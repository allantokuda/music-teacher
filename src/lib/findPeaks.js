// Find peaks in FFT data
export default function findPeaks(fftGains) {
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
