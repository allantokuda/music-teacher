// Find overtone series: sets of frequencies (fft indices)
// that follow a 1x,2x,3x,4x frequency pattern
export default function findOvertoneSeries(indices) {
  const indicesWithOvertones = [];
  const overtoneIndices = [];
  for (let i = 0; i < indices.length; i++) {
    let tone = indices[i];
    let overtoneCount = 0;
    if (overtoneIndices.find((index) => index === tone)) {
      continue; // skip to next loop; don't look for overtones of overtones
    }
    for (let j = i+1; j < indices.length; j++) {
      let overtone = indices[j];
      for (let multiple = 2; multiple <= 5; multiple++) {
        //console.log(tone, overtone, multiple, overtone / multiple - tone);
        if (Math.abs(overtone / multiple - tone) <= 1) {
          overtoneCount++;
          overtoneIndices.push(overtone)
        }
      }
    }
    if (overtoneCount >= 1) {
      indicesWithOvertones.push({ index: tone, overtoneCount });
    }
  }
  //console.log(indicesWithOvertones);
  return indicesWithOvertones;
}
