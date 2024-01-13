import { SCALE } from "$lib/pitch";

const PEAK_STANDARD_DEVIATION_SCALE = 0.015; // multiply this by frequency to get standard deviation of an expected peak's gaussian curve at that frequency

function gaussian(x: number, mean: number, std: number): number {
  return Math.exp(-((x - mean) ** 2) / (2 * std ** 2));
}

function subtractGaussianPeak(fft_gains: number[], freq: number): number[] {
  const center_index = Math.floor(freq / SCALE);
  const min_index = Math.floor(freq * 0.97 / SCALE);
  const max_index = Math.floor(freq * 1.03 / SCALE);
  const gains_sample = fft_gains.slice(min_index, max_index - min_index);
  const max_gain = Math.max(...gains_sample);
  const std = PEAK_STANDARD_DEVIATION_SCALE * center_index;
  let result = fft_gains;
  for (let i = min_index; i <= max_index; i++) {
    result[i] -= gaussian(i, center_index, std) * max_gain;
  }
  return result;
}

export default function subtractOvertones(fft_gains: number[], tonic_freq: number): number[] {
  let result = fft_gains;
  [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8].forEach((multiple) => {
    const overtone_freq = tonic_freq * multiple;
    subtractGaussianPeak(result, overtone_freq);
  })
  return result;
}
