import { SCALE } from "$lib/pitch";
import type { FFTPoint } from "$lib/types";

const PEAK_STANDARD_DEVIATION_SCALE = 0.015; // multiply this by frequency to get standard deviation of an expected peak's gaussian curve at that frequency
const PEAK_SEARCH_COUNT = 50;
const PITCH_REDUCTION_RATIO_THRESHOLD = 0.6; // ratio
const SMALL_PEAK_GAIN_THRESHOLD = 2; // dB

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
  if (center_gain < 0) { return; }
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

export function fftMaxGain(fft_gains: number[]): FFTPoint {
  return fft_gains.reduce(
    (max, gain, i) => {
      return gain > max.gain ? { index: i, gain: gain } as FFTPoint : max;
    }, { index: -1, gain: -Infinity }
  );
}


// LATER: build on this to attempt a determine-the-pitches approach
// instead of a check-for-specific-pitches approach
export function findGaussianPeaks(fft_gains: number[]): FFTPoint[] {
  let peaks: FFTPoint[] = [];
  let fft_gains_copy = fft_gains.slice();

  // Loop PEAK_SEARCH_COUNT times:
  // - Find tallest peak in the FFT.
  // - Add the peak to an list of found peaks: remember its gain and index
  // - Subtract the peak from the FFT using gaussian curve
  // At some point after removing lots of peaks, all that will remain is noise and further peak removal should not cause much reduction in max gain within the FFT.
  for (let i = 0; i < PEAK_SEARCH_COUNT; i++) {
    const peak = fftMaxGain(fft_gains_copy);
    if (peak.gain < SMALL_PEAK_GAIN_THRESHOLD) { break; }
    peaks.push(peak);
    subtractGaussianPeak(fft_gains_copy, peak.index * SCALE);
  }

  // SEE IF THIS CAN REPLACE THE OTHER NOISE REJECTOR:
  // After the loop, compare the first peak to the last peak.
  // If the last peak is less than 60% of the first peak, then we will consider the sound to be pitches and not noise.
  // const firstPeak = peaks[0];
  // const lastPeak = peaks[peaks.length - 1];
  // const isNoise = (peaks[peaks.length-1].gain / peaks[0].gain) < PITCH_REDUCTION_RATIO_THRESHOLD;

  return peaks;

  // Find the last peak for which its subsequent peak is at least SMALL_PEAK_GAIN_THRESHOLD dB lower.
  // Shorten the list of peaks to only include peaks up to that point.
  // let lastPeakIndex = peaks.length - 1;
  // for (let i = peaks.length - 2; i >= 0; i--) {
  //   if (peaks[i+1].gain < peaks[i].gain - SMALL_PEAK_GAIN_THRESHOLD) {
  //     lastPeakIndex = i;
  //     break;
  //   }
  // }

  // if (peaks.length === PEAK_SEARCH_COUNT) {
  //   return []
  // }

  // return peaks.slice(0, lastPeakIndex);
}
