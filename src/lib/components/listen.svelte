<script>
  import * as Tone from 'tone'
  import { browser } from '$app/environment';

  let fft_gains;
  let fft_gains_prev;
  let fft_diffs;
  let note_gains;

  function reset() {
    fft_gains = []
    fft_gains_prev = []
    fft_diffs = []
    note_gains = []
  }
  reset();

  let integer_series = new Array(60).fill().map((_, i) => i);
  let note_freqs = integer_series.map((i) => C2 * 2**(i/12))
  let note_indices = note_freqs.map((f) => indexOfFreq(f))

  const SCALE = 1.345825195
  const C2 = 65.4

  function indexOfFreq(freq) {
    return Math.round(freq/SCALE)
  }

  function noteForIndex(index) {
    return ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][index % 12]
  }

  function colorForIndex(index) {
    return noteForIndex(index).includes('#') ? 'black' : 'white';
  }

  let mic;
  let interval;

  function startAudio() {
    if (browser) {
      window.Tone = Tone

      let fft = new Tone.FFT(16384)
      mic = new Tone.UserMedia()
      Tone.start()
      mic.open().then(() => {
        mic.connect(fft)
        interval = setInterval(() => {
          fft_gains_prev = fft_gains
          fft_gains = fft.getValue();
          fft_diffs = fft_gains.map((g, i) => g - fft_gains_prev[i])
          note_gains = note_indices.map((i) => fft_gains[i]);
        }, 30)
      })
    }
  }

  function stopAudio() {
    if (browser) {
      mic.close();
      reset();
      clearInterval(interval);
    }
  }

</script>

<button on:click={startAudio}>Start</button>
<button on:click={stopAudio}>Stop</button>

<div class="graph">
{#each note_gains as gain, i}
  <div class="bar {colorForIndex(i)}" style="height: {150+gain}px;">
    {noteForIndex(i)}
  </div>
{/each}
</div>

<div class="graph">
{#each fft_gains.slice(0,400) as gain, i}
  <div class="bar fft black {note_indices.includes(i) ? 'note' : ''}" style="height: {150+gain}px;">
  </div>
{/each}
</div>

<div class="graph">
{#each fft_diffs.slice(0,400) as diff, i}
  <div class="bar fft black {note_indices.includes(i) ? 'note' : ''} {diff > 0 ? 'up' : 'down'}" style="height: {Math.abs(diff)*10}px;">
  </div>
{/each}
</div>

<style>
  .graph {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 200px;
  }
  .bar {
    width: 24px;
    text-align: center;
    border: 1px solid gray;
    display: inline-block;
    min-height: 35px;
    overflow-wrap: anywhere;
  }
  .bar.fft {
    width: 1px;
    border: none;
    min-height: 0px;
  }
  .bar.fft.note {
    background-color: red;
  }
  .bar.fft.down {
    background-color: blue;
  }
  .bar.black {
    background-color: black;
    color: white;
  }
  .bar.white {
    background-color: white;
    color: black;
  }
</style>
