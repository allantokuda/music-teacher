import { expect, test } from 'vitest';
import Composer from './Composer';

test('Composer generates a sequence of notes', () => {
  let composer = new Composer(12345);
  let measure = composer.writeMeasure()
  expect(measure.easyScore).toEqual('F4/q, D4, F4, G4');
  expect(measure.notes.map((n) => n.pitch_name)).toEqual(['F4', 'D4', 'F4', 'G4']);
});
