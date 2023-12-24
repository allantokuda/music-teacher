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

// Find peaks in FFT data
export function findPeaks(fftGains) {
  let peaks = []

  let upSteps = 0;
  let downSteps = 0;
  let peakCandidate = null;
  for (let i = 49; i<1468; i++) {
    const n = Math.floor(i/35.66)
    // Define a peak as the middle of a sequence of numbers
    // where there are n upward steps and then n downward steps,
    // where n is a fraction of the index i that is approximately one musical quarter step
    // (for an FFT of size 16384 from a 22050 Hz sample rate)
    // Loop through a usable range of indices,
    // remember how many upward steps have been taken in a row
    // and then how many downward steps have been taken in a row.
    // When that sequence is reached, add the peak index to the peaks list.
    // Any upward step resets the downward step count to 0; same vice-versa.
    if (fftGains[i] > fftGains[i-1]) {
      upSteps++;
      downSteps = 0;
    } else if (fftGains[i] < fftGains[i-1]) {
      if (upSteps >= n) {
        peakCandidate = i - 1;
      }
      downSteps++;
      upSteps = 0;
      if (downSteps === n && peakCandidate) {
        peaks.push(peakCandidate);
        peakCandidate = null;
      }
    }
  }
  return peaks;
}

