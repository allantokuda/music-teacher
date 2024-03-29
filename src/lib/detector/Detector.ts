import { pitches } from '$lib/pitch'
import step1_stackOvertones from './functions/step1_stackOvertones.js'
import subtractOvertones    from './functions/subtractOvertones.js'
import { fftMaxGain } from './functions/subtractOvertones.js'
import step2_findPeaks      from './functions/step2_findPeaks'
import step3_findPeakTracks from './functions/step3_findPeakTracks.js'
import step4_findAttacks    from './functions/step4_findAttacks.js'
import type { Pitch, Peak } from '$lib/types'
import { lnCurveFit, normalize } from './functions/normalize.js'

export interface DetectorData {
  fft_gains: number[]
  fft_gains_minus_peaks: number[]
  fft_diffs: number[]
  pitch_gains: number[]
  fft_peaks: Peak[]
  peak_history: Peak[][]
  attack_fft_indices: number[]
  //attack_pitch_numbers: number[]
}

const RISE_THRESHOLD = 200;
const DROP_THRESHOLD = 100;
const FFT_SIZE = 16384;

export default class Detector {
  fftCallback: (fft_gains: DetectorData) => void = () => {};
  noteCallback: (pitch: Pitch) => void = () => {};
  debugCallback: (msg: string) => void = () => {};
  listenForFreqs: number[] = pitches.slice(24,25).map((p) => p.freq);
  pitchIndices: number[] = [];

  private interval: ReturnType<typeof setInterval> | undefined = undefined;

  constructor() {}

  onFFTData(callback: (fft_gains: DetectorData) => void) {
    this.fftCallback = callback;
  }

  onNote(callback: (pitch: Pitch) => void) {
    this.noteCallback = callback;
  }

  onDebugInfo(callback: (msg: string) => void) {
    this.debugCallback = callback;
  }

  start(): void {
    const audioCtx = new AudioContext();
    const FFT_SCALE = audioCtx.sampleRate / FFT_SIZE / 2;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE * 2;
    const fft_gains_raw = new Float32Array(FFT_SIZE);

    this.pitchIndices = pitches.map((p) => Math.round(p.freq / FFT_SCALE));

    navigator.mediaDevices.getUserMedia({ audio: true}).then((stream) => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      let riseThresholdReached = false;

      let fft_gains_prev: number[] = [];
      let fft_gains_normalized: number[] = [];
      let fft_gains_copy_to_remove_peaks: number[] = [];
      let fft_gains_copy_to_remove_expected_peaks: number[] = [];
      const peak_history: Peak[][] = [];
      let fft_diffs: number[];
      let fft_diff_sum: number;

      this.interval = setInterval(() => {
        analyser.getFloatFrequencyData(fft_gains_raw);

        const fft_gains = step1_stackOvertones(fft_gains_raw);
        const fft_peaks = step2_findPeaks(fft_gains.slice(0,2000), 20);
        const pitch_fft_indexes = pitches.map((p) => Math.round(p.freq / FFT_SCALE));
        const pitch_gains = pitch_fft_indexes.map((i) => fft_gains[i]);

        if (fft_gains_prev) {
          fft_diffs = fft_gains.map((g, i) => g - fft_gains_prev[i])
        } else {
          fft_diffs = [];
        }
        fft_diff_sum = fft_diffs.reduce((sum, diff) => sum + diff, 0);
        if (fft_diff_sum > RISE_THRESHOLD) {
          riseThresholdReached = true;
        }

        if (fft_diff_sum < DROP_THRESHOLD && riseThresholdReached) {
          riseThresholdReached = false;

          // Normalize to a flat baseline using an logarithmic curve fit
          const fit = lnCurveFit(fft_gains.slice(100));
          fft_gains_normalized = normalize(fft_gains, fit.A, fit.B);
          this.debugCallback(`fft norm size ${fft_gains_normalized.length}`);

          fft_gains_copy_to_remove_peaks = fft_gains_normalized.slice();

          const max = fftMaxGain(fft_gains_normalized);

          // Remove several peaks and their overtones
          let reducedMax = max;
          for (let i = 0; i < 10; i++) {
            subtractOvertones(fft_gains_copy_to_remove_peaks, reducedMax.index);
            reducedMax = fftMaxGain(fft_gains_copy_to_remove_peaks);
          }

          const noiseReducedFraction = (reducedMax.gain / max.gain);
          let pitchReducedFraction;

          if (noiseReducedFraction > 0.45) {
            console.log(noiseReducedFraction.toFixed(2), '-- noise --')
            // this.debugCallback(`noise ${noiseReducedFraction.toFixed(2)}`);

          } else {

            // console.log(fft_gains_copy_to_remove_peaks.map((g, i) => `${fft_gains_normalized[i].toFixed(1)}\t${g.toFixed(1)}`).join('\n'));
            fft_gains_copy_to_remove_expected_peaks = fft_gains_normalized.slice();

            // Now see if the expected pitches stand alone
            this.listenForFreqs.forEach((freq) => {
              // this.debugCallback(`freq ${freq.toFixed(2)}`);
              subtractOvertones(fft_gains_copy_to_remove_expected_peaks, freq / FFT_SCALE);
            });
            const reducedMax = fftMaxGain(fft_gains_copy_to_remove_expected_peaks);
            pitchReducedFraction = (reducedMax.gain / max.gain);

            if (pitchReducedFraction < 0.65) {
              //console.log(fft_gains_copy_to_remove_peaks.map((g, i) => `${fft_gains_normalized[i].toFixed(0)}\t${g.toFixed(0)}`).join('\n'));
              console.log(pitchReducedFraction.toFixed(2), 'Expected pitches detected!')
              this.noteCallback(null);
              // this.debugCallback(`pitchReducedFraction+ ${pitchReducedFraction.toFixed(2)}`);
            } else {
              console.log(pitchReducedFraction.toFixed(2), 'Pitches detected (some not expected)')
              // this.debugCallback(`pitchReducedFraction- ${pitchReducedFraction.toFixed(6)}`);
            }

          }
        }

        peak_history.push(fft_peaks);

        let peak_tracks = [];
        let attack_tracks = [];
        let attack_fft_indices: number[] = [];
        //let attack_pitch_numbers: number[] = []; // pitches may not be in range -> undefined
        if (peak_history.length > 5) {
          peak_history.shift()
          peak_tracks = step3_findPeakTracks(peak_history);
          attack_tracks = step4_findAttacks(peak_tracks);
          attack_fft_indices = attack_tracks.map((track) => track.index);
          //attack_pitch_numbers = attack_fft_indices.map(pitchNumForIndex).filter((n) => n !== undefined) as number[]; // TS doesn't see that I'm filtering by undefined
        }

        // if (attack_pitch_numbers.length > 0) {
        //   const pitch_num = attack_pitch_numbers[0];
        //   this.noteCallback(pitches[pitch_num]);
        // }

        if (this.fftCallback) {
          this.fftCallback({
            fft_gains: fft_gains_normalized,
            fft_gains_minus_peaks: fft_gains_copy_to_remove_expected_peaks,
            fft_diffs,
            pitch_gains,
            fft_peaks,
            peak_history,
            attack_fft_indices,
            //attack_pitch_numbers,
          });
        }

        fft_gains_prev = fft_gains;
      }, 30)
    })
  }

  listenFor(freqs: number[]): void {
    this.listenForFreqs = freqs;
  }

  stop(): void {
    this.mic?.close();
    clearInterval(this.interval);
  }

}