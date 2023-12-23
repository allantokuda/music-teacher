<script>
  import * as Tone from 'tone'
  import { browser } from '$app/environment';

  let values = []
  let freqs = []

  const SCALE = 1.345825195
  function indexOfFreq(freq) {
    return Math.round(freq/SCALE)
  }

  function colorForIndex(index) {
    return [1,4,6,9,11].includes(index % 12) ? 'black' : 'white';
  }

  function startAudio() {
    if (browser) {
      window.Tone = Tone

      const nums = new Array(60).fill().map((_, i) => i);
      let freqs = nums.map((i) => 55 * 2**(i/12))
      let indices = freqs.map((f) => indexOfFreq(f))
      let fft = new Tone.FFT(16384)
      let mic = new Tone.UserMedia()
      mic.open().then(() => {
        mic.connect(fft)
        Tone.Transport.start()
        setInterval(() => {
          let all_gains = fft.getValue();
          values = indices.map((i) => all_gains[i]);
        }, 50)
      })
    }
  }

</script>

<button on:click={startAudio}>Start</button>

<div>
{#each values as value, i}
  <div style="height: {100+value}px; width: 10px; background-color: {colorForIndex(i)}; border: 1px solid gray; display: inline-block;"></div>
{/each}
</div>
