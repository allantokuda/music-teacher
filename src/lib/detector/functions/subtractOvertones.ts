import { SCALE } from "$lib/pitch";

const PEAK_STANDARD_DEVIATION_SCALE = 0.015; // multiply this by frequency to get standard deviation of an expected peak's gaussian curve at that frequency

function gaussian(x: number, mean: number, std: number): number {
  return Math.exp(-((x - mean) ** 2) / (2 * std ** 2));
}

// Pass gains array by reference and modify it in place
function subtractGaussianPeak(fft_gains: number[], freq: number): void {
  const center_index = Math.round(freq / SCALE);
  const min_index = Math.round(freq * 0.97 / SCALE);
  const max_index = Math.round(freq * 1.03 / SCALE);
  if (min_index > fft_gains.length - 1) { return; }
  const center_gain = fft_gains[center_index];
  const std = PEAK_STANDARD_DEVIATION_SCALE * center_index;
  for (let i = min_index; i <= Math.min(fft_gains.length - 1, max_index); i++) {
    fft_gains[i] -= gaussian(i, center_index, std) * center_gain;
  }
}

export default function subtractOvertones(fft_gains: number[], tonic_freq: number): void {
  [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].forEach((multiple) => {
    const overtone_freq = tonic_freq * multiple;
    subtractGaussianPeak(fft_gains, overtone_freq);
  })
}
