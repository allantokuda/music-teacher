import type { Pitch } from '$lib/types';
const C2_Freq = 65.4;
const NOTE_RANGE = 60;
const integer_series: number[] = new Array(NOTE_RANGE).fill(0).map((_, i) => i);
export const pitchClasses = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// { pitch_num: 0, pitch_name: 'C2',  freq: 65.4 },
// { pitch_num: 1, pitch_name: 'C#2', freq: 69.3 },
// { pitch_num: 2, pitch_name: 'D2',  freq: 73.4 },
// etc.
export const pitches = integer_series.map((i) => {
  const octave = Math.floor(i/12) + 2;
  const pitch_num = i;
  const pitch_name = `${pitchClasses[i%12]}${octave}`;
  const freq = C2_Freq * 2**(i/12);
  const rounded_freq = Math.round(freq * 100) / 100;
  return { pitch_num, pitch_name, freq: rounded_freq } as Pitch;
});

export function pitchName(pitchNum: number): string {
  return pitches[pitchNum].pitch_name;
}

export function pitchNumForFreq(freq: number) {
  return Math.round(12 * Math.log(freq/C2_Freq)/Math.log(2));
}

export function randomPitch() {
  const pitch_num = Math.floor(Math.random() * 36) + 12; // C3 to C5 for now
  return pitches[pitch_num];
}
