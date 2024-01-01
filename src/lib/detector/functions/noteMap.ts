const C2_Freq = 65.4;
const SCALE = 1.345825195; // 22050 sample rate and 16384 fft size
const NOTE_RANGE = 60;
const integer_series: number[] = new Array(NOTE_RANGE).fill(0).map((_, i) => i);
export const noteFreqs = integer_series.map((i) => C2_Freq * 2**(i/12))
export const noteIndices = noteFreqs.map((f) => indexOfFreq(f))
export const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export function noteName(noteNum: number) {
  const octave = Math.floor(noteNum / 12) + 2;
  return `${notes[noteNum % 12]}${octave}`;
}

export function indexOfFreq(freq: number) {
  return Math.round(freq / SCALE);
}

export function freqOfIndex(fftIndex: number) {
  return fftIndex * SCALE;
}

export function noteGains(fftGains: number[]) {
  return noteIndices.map((i) => fftGains[i]);
}

export function noteNumForFreq(freq: number) {
  return Math.round(12 * Math.log(freq/C2_Freq)/Math.log(2));
}

export function noteNumForIndex(fftIndex: number) {
  return noteNumForFreq(freqOfIndex(fftIndex));
}

export function randomNote() {
  //const note_num = Math.floor(Math.random() * NOTE_RANGE);
  const note_num = Math.floor(Math.random() * 36) + 12; // C3 to C5 for now
  const note_name = noteName(note_num);
  return {
    note_num,
    note_name
  }
}
