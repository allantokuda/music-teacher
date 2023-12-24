const THRESHOLD = 5;

// Find peaks in FFT data
export default function findPeaks(fftGains) {
  // First find values larger value than their immediate neighbors.
  // This is not robust to noise.
  // It returns 50 to 100 peaks within this 5 octave range.
  let peaks = []
  for (let i = 49; i<1468; i++) {
    if (fftGains[i] > fftGains[i-1] && fftGains[i] > fftGains[i+1]) {
      const n = Math.floor(i/35.66)
      const localArea = fftGains.slice(i-n, i+n);
      const localMax = Math.max(...localArea);
      const localMin = Math.min(...localArea);
      if (fftGains[i] === localMax &&
        fftGains[i] > fftGains[i-n] + THRESHOLD &&
        fftGains[i] > fftGains[i+n] + THRESHOLD) {
        peaks.push(i);
        //peaks.push({ i, height: localMax - localMin });
      }
    }
  }
  //return peaks.sort((a, b) => b.height - a.height).map((p) => p.i); // in case I need the largest peaks
  //console.log(peaks.length);
  return peaks;
}
