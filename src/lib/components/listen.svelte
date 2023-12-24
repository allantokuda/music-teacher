<script>
  import * as Tone from 'tone'
  import { browser } from '$app/environment';
  import { noteFreqs, noteIndices, noteGains, indexOfFreq, findPeaks } from '$lib/fft_processing.js'
  import PianoGraph from '$lib/components/PianoGraph.svelte'
  import FFTGraph from '$lib/components/FFTGraph.svelte'
  import FFTDiffGraph from '$lib/components/FFTDiffGraph.svelte'

  let fft_gains;
  let fft_gains_prev;
  let fft_diffs;
  let note_gains;
  let fft_peaks;

  function resetData() {
    fft_gains = []
    fft_gains_prev = []
    fft_diffs = []
    fft_peaks = []
    note_gains = []
  }
  resetData();

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
          note_gains = noteGains(fft_gains);
        }, 30)
      })
    }
  }

  function stopAudio() {
    if (browser) {
      mic.close();
      resetData();
      clearInterval(interval);
      interval = null;
    }
  }

</script>

<div class="controls">
  {#if interval}
    <button on:click={stopAudio}>Stop</button>
  {:else}
    <button on:click={startAudio}>Start</button>
  {/if}
</div>

<PianoGraph noteGains={note_gains} />
<FFTGraph fft_gains={fft_gains} />
<FFTDiffGraph fft_diffs={fft_diffs} />

<style>
  button {
    width: 100px;
  }
</style>
