import { expect, test } from 'vitest';
import Composer from './Composer';

test('Composer generates a sequence of notes', () => {
  let composer = new Composer(12345);
  let notes = composer.writeMeasure()
  expect(notes).toEqual('F4/q, D4, F4, G4');
});
