const RISE_THRESHOLD = 0.5;
// Find "attacks" (sudden up-trends) in FFT data
export default function findAttacks(peak_tracks) {
  return peak_tracks.filter((track) => {
    return track.gain_steps.reduce((acc, gain_step) => {
      return gain_step > RISE_THRESHOLD;
    }, true)
  })
}
