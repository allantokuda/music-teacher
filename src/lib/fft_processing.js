const C2_Freq = 65.4;
const SCALE = 1.345825195; // 22050 sample rate and 16384 fft size
const integer_series = new Array(60).fill().map((_, i) => i);
export const noteFreqs = integer_series.map((i) => C2_Freq * 2**(i/12))
export const noteIndices = noteFreqs.map((f) => indexOfFreq(f))
export const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export function noteName(noteNum) {
  return notes[noteNum % 12]
}

export function indexOfFreq(freq) {
  return Math.round(freq / SCALE);
}

export function freqOfIndex(fftIndex) {
  return fftIndex * SCALE;
}

export function noteGains(fftGains) {
  return noteIndices.map((i) => fftGains[i]);
}

export function noteNumForFreq(freq) {
  return Math.round(12 * Math.log(freq/C2_Freq)/Math.log(2));
}

export function noteNumForIndex(fftIndex) {
  return noteNumForFreq(freqOfIndex(fftIndex));
}
