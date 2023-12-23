<script>
  import * as Tone from 'tone'
  import { browser } from '$app/environment';

  let values = []
  let freqs = []

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

      const nums = new Array(60).fill().map((_, i) => i);
      let freqs = nums.map((i) => C2 * 2**(i/12))
      let indices = freqs.map((f) => indexOfFreq(f))
      let fft = new Tone.FFT(16384)
      let mic = new Tone.UserMedia()
      Tone.start()
      mic.open().then(() => {
        mic.connect(fft)
        setInterval(() => {
          let all_gains = fft.getValue();
          values = indices.map((i) => all_gains[i]);
        }, 10)
      })
    }
  }

</script>

<button on:click={startAudio}>Start</button>

<div class="graph">
{#each values as value, i}
  <div class="bar {colorForIndex(i)}" style="height: {120+value}px;">
    {noteForIndex(i)}
  </div>
{/each}
</div>

<style>
  .graph {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
  .bar.black {
    background-color: black;
    color: white;
  }
  .bar.white {
    background-color: white;
    color: black;
  }
</style>
