<script>
  import * as Tone from 'tone'
  import { browser } from '$app/environment';

  let fft_gains = []
  let note_gains = []

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


  function startAudio() {
    if (browser) {
      window.Tone = Tone

      let fft = new Tone.FFT(16384)
      let mic = new Tone.UserMedia()
      Tone.start()
      mic.open().then(() => {
        mic.connect(fft)
        setInterval(() => {
          fft_gains = fft.getValue();
          note_gains = note_indices.map((i) => fft_gains[i]);
        }, 10)
      })
    }
  }

</script>

<button on:click={startAudio}>Start</button>

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
  }
  .bar.fft.note {
    background-color: red;
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
