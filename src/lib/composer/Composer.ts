import PRNG from 'prng';

export default class Composer {
  prng: PRNG;
  constructor(seed: number = Date.now()) {
    this.prng = new PRNG(seed);
  }

  writeMeasure(): string {
    return [
      this.randomNote() + '/q',
      this.randomNote(),
      this.randomNote(),
      this.randomNote(),
    ].join(', ');
  }

  // Just start with a C scale for now
  randomNote(): string {
    const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    return scale[this.prng.rand(7)];
  }
}
