const THRESHOLD = 5;

// Find peaks in FFT data
export default function findPeaks(fftGains) {
  // First find values larger value than their immediate neighbors.
  // This is not robust to noise.
  // It returns 50 to 100 peaks within this 5 octave range.
  let peaks = []
  for (let i = 49; i<1468; i++) {
    if (fftGains[i] > fftGains[i-1] && fftGains[i] > fftGains[i+1]) {
      peaks.push(i);
    }
  }

  // Filter to only the peaks that are the highest in their local neighborhood. This returns about 20 to 40 peaks.
  // Filter further to only the peaks that are higher than their neighbors by a certain threshold. This returns about 3 to 15 peaks.
  let goodPeaks = [];
  for (let p = 0; p<peaks.length; p++) {
    let i = peaks[p];
    const n = Math.floor(i/35.66)
    const localArea = fftGains.slice(i-n, i+n);
    const localMax = Math.max(...localArea);
    const localMin = Math.min(...localArea);
    if (fftGains[i] === localMax &&
      fftGains[i] > fftGains[i-n] + THRESHOLD &&
      fftGains[i] > fftGains[i+n] + THRESHOLD) {
      goodPeaks.push(i);
    }
  }
  //console.log(goodPeaks.length);
  return goodPeaks;
}
