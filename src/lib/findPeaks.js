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

  // This filters to only the peaks that are the highest in their local neighborhood.
  // This returns about 20 to 40 peaks.
  let goodPeaks = [];
  for (let p = 0; p<peaks.length; p++) {
    let i = peaks[p];
    const n = Math.floor(i/35.66)
    if (fftGains[i] === Math.max(...fftGains.slice(i-n, i+n))) {
      goodPeaks.push(i);
    }
  }
  //console.log(goodPeaks.length);
  return goodPeaks;
}
