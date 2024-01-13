const FFT_SIZE = 16384;
const NUM_OVERTONES = 8;

function integerArray(size: number): number[] {
  return new Array(size).fill(0).map((_, i) => i);
}
const result_indices = integerArray(FFT_SIZE/NUM_OVERTONES);
const multiples = integerArray(NUM_OVERTONES).map((i) => i+1);

function normalize(fftGains: number[]): number[] {
  // Work in the higher frequency half of the data which will mostly have uniform noise and avoids low-frequency artifacts
  const avgGain = fftGains.slice(1000, 2000).reduce((sum, gain) => sum + gain, 0) / 1000;
  const scale = avgGain / (1 + Math.log(1500)) * 0.5;
  return fftGains.map((gain, i) => gain - (scale * (1 + Math.log(i))));
}

export default function step1_stackOvertones(fftGains: Float32Array): number[] {
  return normalize(
    result_indices.map((i) => {
      return multiples.reduce((sum, multiple) => {
        return sum + fftGains[i*multiple]/multiple;
      }, 0);
    })
  );
}
