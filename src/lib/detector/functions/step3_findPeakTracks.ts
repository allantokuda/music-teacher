// Find "peak tracks" - sets of peaks that are close together in frequency across time
// In this example: two peak tracks are found that last the entire duration of the history.
// One of them is at index 100, the other at index 200.
// The track at index 200 shifts up in frequency at index 201 and then shifts
// back down to 200 but is treated as one "track" because it only shifts by 1
// and no ambiguity is introduced because no other peaks are within 1 index.
//
// peak_history = [
//   [{ i: 100, gain: 0.5 }, { i: 200, gain: 0.6 }, { i: 300, gain: 0.7 }]
//   [{ i: 100, gain: 0.6 }, { i: 201, gain: 4.8 }]
//   [{ i: 100, gain: 0.4 }, { i: 200, gain: 9.9 }]
// ]

import type { Peak, PeakTrack } from '../types';

interface RawPeakTrack {
  steps: {
    t: number
    from: Peak
    to: Peak
  }[]
}

export default function findPeakTracks(peak_history: Peak[][]): PeakTrack[] {
  let raw_peak_tracks: RawPeakTrack[] = []
  for (let t = 1; t < peak_history.length; t++) {
    const previous_set = peak_history[t-1];
    const current_set = peak_history[t];
    const new_raw_track: RawPeakTrack = { steps: [] };

    // Find overlap between current and previous sets
    // allowing for 1 index shift
    for (let j = 0; j < previous_set.length; j++) {
      for (let k = 0; k < current_set.length; k++) {
        if (Math.abs(previous_set[j].i - current_set[k].i) <= 1) {
          new_raw_track.steps.push({ t: t, from: previous_set[j], to: current_set[k] });
        }
      }
    }

    new_raw_track.steps.forEach((new_track_step) => {
      let existing_track = raw_peak_tracks.find((track) => {
        return track.steps[track.steps.length-1].to === new_track_step.from;
      });
      if (existing_track) {
        existing_track.steps.push(new_track_step);
      } else {
        raw_peak_tracks.push({ steps: [new_track_step] });
      }
    });
  }

  let peak_tracks = raw_peak_tracks.map((track) => {
    const gains: number[] = [track.steps[0].from.gain].concat(track.steps.map((step) => step.to.gain));
    const gain_steps: number[] = track.steps.map((step) => step.to.gain - step.from.gain);
    return {
      index: track.steps[0].from.i, // later could consider taking the median if there is a lot of drift
      gains: gains,
      gain_steps: gain_steps, // not used yet but could be useful for note detection later
    }
  })
  //console.log(peak_tracks);
  return peak_tracks;
}
