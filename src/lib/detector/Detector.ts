import * as Tone from 'tone'

import { pitches, pitchGains, pitchNumForIndex } from '$lib/pitch'
import step1_stackOvertones from './functions/step1_stackOvertones.js'
import step2_findPeaks      from './functions/step2_findPeaks'
import step3_findPeakTracks from './functions/step3_findPeakTracks.js'
import step4_findAttacks    from './functions/step4_findAttacks.js'
import type { Pitch, Peak } from '$lib/types'
import { lnCurveFit, normalize } from './functions/normalize.js'

export interface DetectorData {
  fft_gains: number[]
  fft_diffs: number[]
  pitch_gains: number[]
  fft_peaks: Peak[]
  peak_history: Peak[][]
  attack_fft_indices: number[]
  attack_pitch_numbers: number[]
}

const RISE_THRESHOLD = 100;
const DROP_THRESHOLD = 60;

export default class Detector {
  fftCallback: (fft_gains: DetectorData) => void = () => {};
  noteCallback: (pitch: Pitch) => void = () => {};

  private interval: ReturnType<typeof setInterval> | undefined = undefined;
  private mic: Tone.UserMedia | null = null;

  constructor() {}

  onFFTData(callback: (fft_gains: DetectorData) => void) {
    this.fftCallback = callback;
  }

  onNote(callback: (pitch: Pitch) => void) {
    this.noteCallback = callback;
  }

  start(): void {
    let fft = new Tone.FFT(16384);
    this.mic = new Tone.UserMedia();
    Tone.start()
    this.mic.open().then(() => {
      this.mic?.connect(fft)
      let riseThresholdReached = false;

      let fft_gains_prev: number[] = [];
      let peak_history: Peak[][] = [];
      let fft_diffs: number[];
      let fft_diff_sum: number;
      let baselineFit = { A: -Infinity, B: -Infinity };
      let fitSampleValueMin = -Infinity;

      this.interval = setInterval(() => {
        let stacked_fft_gains = step1_stackOvertones(fft.getValue());

        // Normalize to a running minimum baseline fit
        let fit = lnCurveFit(stacked_fft_gains);
        let fitSampleValue = fit.A + fit.B * Math.log(1000); // 1000 is arbitrary
        if (fitSampleValue > fitSampleValueMin) {
          fitSampleValueMin = fitSampleValue;
          baselineFit = fit;
        }
        let fft_gains = normalize(stacked_fft_gains, baselineFit.A, baselineFit.B);

        let fft_peaks = step2_findPeaks(fft_gains.slice(0,2000), 20);
        let pitch_gains = pitchGains(fft_gains);

        if (fft_gains_prev) {
          fft_diffs = fft_gains.map((g, i) => g - fft_gains_prev[i])
        } else {
          fft_diffs = [];
        }
        fft_diff_sum = fft_diffs.reduce((sum, diff) => sum + diff, 0);
        if (fft_diff_sum > RISE_THRESHOLD) {
          // if (!riseThresholdReached) {
          //   console.log('Rise threshold reached', fft_diff_sum);
          // }
          riseThresholdReached = true;
        }
        if (fft_diff_sum < DROP_THRESHOLD && riseThresholdReached) {
          riseThresholdReached = false;
          console.log('Sound detected!')
          const maxGain = fft_gains.reduce((max, gain) => { return gain > max ? gain : max });
          const gainThreshold = maxGain * 0.5;

        }

        peak_history.push(fft_peaks);

        let peak_tracks = [];
        let attack_tracks = [];
        let attack_fft_indices: number[] = [];
        let attack_pitch_numbers: number[] = []; // pitches may not be in range -> undefined
        if (peak_history.length > 5) {
          peak_history.shift()
          peak_tracks = step3_findPeakTracks(peak_history);
          attack_tracks = step4_findAttacks(peak_tracks);
          attack_fft_indices = attack_tracks.map((track) => track.index);
          attack_pitch_numbers = attack_fft_indices.map(pitchNumForIndex).filter((n) => n !== undefined) as number[]; // TS doesn't see that I'm filtering by undefined
        }

        if (attack_pitch_numbers.length > 0) {
          const pitch_num = attack_pitch_numbers[0];
          this.noteCallback(pitches[pitch_num]);
        }

        if (this.fftCallback) {
          this.fftCallback({
            fft_gains,
            fft_diffs,
            pitch_gains,
            fft_peaks,
            peak_history,
            attack_fft_indices,
            attack_pitch_numbers,
          });
        }

        fft_gains_prev = fft_gains;
      }, 30)
    })
  }

  stop(): void {
    this.mic?.close();
    clearInterval(this.interval);
  }

}