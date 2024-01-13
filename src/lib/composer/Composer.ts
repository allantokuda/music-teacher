import { pitches } from '$lib/pitch';
import type { Measure, Pitch } from '$lib/types';
import PRNG from 'prng';

const cMajorScale = pitches.filter((p) => p.pitch_name.endsWith('4') && !p.pitch_name.includes('#'));

export default class Composer {
  prng: PRNG;
  constructor(seed: number = Date.now()) {
    this.prng = new PRNG(seed);
  }

  writeMeasure(): Measure {
    // For now notes are just pitches, all quarter notes
    const notes = [
      this.randomPitch(),
      this.randomPitch(),
      this.randomPitch(),
      this.randomPitch()
    ]
    const pitchNames = notes.map((n) => n.pitch_name);
    const easyScore = `${pitchNames[0]}/q, ${pitchNames.slice(1).join(', ')}`;
    return { easyScore, notes }
  }

  // Just start with a C major scale for now (C4 to B4)
  randomPitch(): Pitch {
    return cMajorScale[this.prng.rand(6)];
  }
}
