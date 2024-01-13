export function normalize(fftGains: number[], A: number, B: number): number[] {
  const normalized = fftGains.map((gain, i) => gain - (A + B * Math.log(i+1)));
  return normalized;
}

// Accepts a list of values (y) and returns
// constants A and B for the formula: y = A + B * ln(i)
// representing a natural logarithmic curve fit (y) to the input values.
// The matrix math doesn't care that it's ln(i) so for this, x = ln(i)
export function lnCurveFit(values: number[]): { A: number, B: number } {
  const sumX = values.reduce((sum, _, i) => sum + Math.log(i+1), 0);
  const sumY = values.reduce((sum, value) => sum + value, 0);
  const sumXY = values.reduce((sum, value, i) => sum + value * Math.log(i+1), 0);
  const sumX2 = values.reduce((sum, _, i) => sum + Math.log(i+1) ** 2, 0);
  const N = values.length;
  const B = (N * sumXY - sumX * sumY) / (N * sumX2 - sumX ** 2);
  const A = (sumY - B * sumX) / N;
  return { A, B };
}

