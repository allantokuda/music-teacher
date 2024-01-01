const FFT_SIZE = 16384;
const NUM_OVERTONES = 4;

function integerArray(size: number): number[] {
  return new Array(size).fill(0).map((_, i) => i);
}
const result_indices = integerArray(FFT_SIZE/NUM_OVERTONES);
const multiples = integerArray(NUM_OVERTONES).map((i) => i+1);

export default function step1_stackOvertones(fftGains: Float32Array) {
  return result_indices.map((i) => {
    return multiples.reduce((sum, multiple) => {
      return sum + fftGains[i*multiple]/multiple;
    }, 0);
  });
}
