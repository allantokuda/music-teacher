import type { Peak } from '$lib/types';

const THRESHOLD = 5;

// Find peaks in FFT data
export default function findPeaks(fftGains: number[], threshold=THRESHOLD): Peak[] {
  // First find values larger value than their immediate neighbors.
  // This is not robust to noise.
  // It returns 50 to 100 peaks within this 5 octave range.
  let peaks = []
  for (let i = 49; i<1468; i++) {
    let gain = fftGains[i];
    if (gain > fftGains[i-1] && gain > fftGains[i+1]) {
      const n = Math.floor(i/35.66)
      const localArea = fftGains.slice(i-n, i+n);
      const localMax = Math.max(...localArea);
      const localMin = Math.min(...localArea);
      const height = localMax - localMin;
      if (gain === localMax &&
        gain > fftGains[i-n] + threshold &&
        gain > fftGains[i+n] + threshold) {
        peaks.push({ i, gain, height });
      }
    }
  }
  //console.log(peaks.length);
  return peaks;
}
