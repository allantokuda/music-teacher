import { pitches } from '$lib/pitch';
import type { Measure, Pitch } from '$lib/types';
import PRNG from 'prng';

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
    return {
      easyScore: `${pitchNames[0]}/q, ${pitchNames[1]}, ${pitchNames[2]}, ${pitchNames[3]}`,
      notes: notes,
    }
  }

  // Just start with a C major scale for now (C4 to B4)
  randomPitch(): Pitch {
    const limitedScale = pitches.filter((p) => p.pitch_name.endsWith('4') && !p.pitch_name.includes('#'));
    return limitedScale[this.prng.rand(6)];
  }
}
