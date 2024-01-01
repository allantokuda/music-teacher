import * as Tone from 'tone'

import { noteGains, noteNumForIndex } from './functions/noteMap.js'
import step1_stackOvertones from './functions/step1_stackOvertones.js'
import step2_findPeaks      from './functions/step2_findPeaks'
import step3_findPeakTracks from './functions/step3_findPeakTracks.js'
import step4_findAttacks    from './functions/step4_findAttacks.js'
import type { Peak } from './types'

export interface DetectorData {
  fft_gains: number[]
  fft_diffs: number[]
  note_gains: number[]
  fft_peaks: Peak[]
  peak_history: Peak[][]
  attack_note_indices: number[]
  attack_note_numbers: number[]
}

export default class Detector {
  fftCallback: (fft_gains: DetectorData) => void = () => {};
  noteCallback: (note: number) => void = () => {};

  private interval: number = 0;
  private mic: Tone.UserMedia | null = null;

  constructor() {}

  onFFTData(callback: (fft_gains: DetectorData) => void) {
    this.fftCallback = callback;
  }

  onNote(callback: (note: number) => void) {
    this.noteCallback = callback;
  }

  start(): void {
    let fft = new Tone.FFT(16384);
    this.mic = new Tone.UserMedia();
    Tone.start()
    this.mic.open().then(() => {
      this.mic?.connect(fft)
      let fft_gains_prev: number[] = [];
      let peak_history: Peak[][] = [];
      this.interval = setInterval(() => {
        let fft_gains = step1_stackOvertones(fft.getValue());
        let fft_peaks = step2_findPeaks(fft_gains.slice(0,2000), 20);
        let note_gains = noteGains(fft_gains);

        let fft_diffs: number[];
        if (fft_gains_prev) {
          fft_diffs = fft_gains.map((g, i) => g - fft_gains_prev[i])
        } else {
          fft_diffs = [];
        }

        peak_history.push(fft_peaks);

        let peak_tracks = [];
        let attack_tracks = [];
        let attack_note_indices: number[] = [];
        let attack_note_numbers: number[] = [];
        if (peak_history.length > 5) {
          peak_history.shift()
          peak_tracks = step3_findPeakTracks(peak_history);
          attack_tracks = step4_findAttacks(peak_tracks);
          attack_note_indices = attack_tracks.map((track) => track.index);
          attack_note_numbers = attack_note_indices.map(noteNumForIndex);
        }

        if (this.fftCallback) {
          this.fftCallback({
            fft_gains,
            fft_diffs,
            note_gains,
            fft_peaks,
            peak_history,
            attack_note_indices,
            attack_note_numbers,
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