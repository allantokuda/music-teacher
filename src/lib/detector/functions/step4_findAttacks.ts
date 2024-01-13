import type { PeakTrack } from '$lib/types';

const RISE_THRESHOLD = 2;
// Find "attacks" (sudden up-trends) in FFT data
export default function step4_findAttacks(peak_tracks: PeakTrack[]) {
  return peak_tracks.filter((track) => {
    const first_gain = track.gains[0];
    const last_gain = track.gains[track.gains.length-1];
    return last_gain > first_gain + RISE_THRESHOLD;
  })
}
