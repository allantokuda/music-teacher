const C2_Freq = 65.4;
const integer_series = new Array(60).fill().map((_, i) => i);
export const noteFreqs = integer_series.map((i) => C2_Freq * 2**(i/12))
export const noteIndices = noteFreqs.map((f) => indexOfFreq(f))

export function indexOfFreq(freq) {
  // for 22050 sample rate and 16384 fft size
  return Math.round(freq/1.345825195)
}

export function noteGains(fftGains) {
  return noteIndices.map((i) => fftGains[i]);
}
