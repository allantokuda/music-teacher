<script lang="ts">
  import { browser } from '$app/environment';
  import Detector from '$lib/detector/Detector.ts';

  import PianoGraph from '$lib/detector/components/PianoGraph.svelte';
  import FFTGraph from '$lib/detector/components/FFTGraph.svelte';
  import FFTDiffGraph from '$lib/detector/components/FFTDiffGraph.svelte';

  let detector;
  let data = {};
  let isListening = false;

  if (browser) {
    detector = new Detector();
    detector.onFFTData((returnData) => {
      data = returnData;
    });
  }

  function start() {
    detector.start();
    isListening = true;
  }

  function stop() {
    detector.stop();
    isListening = false;
  }

</script>

<div class="controls">
  {#if isListening}
    <button on:click={stop}>Stop</button>
  {:else}
    <button on:click={start}>Start</button>
  {/if}
</div>

<PianoGraph note_gains={data.note_gains} highlight_note_numbers={data.attack_note_numbers} />
<FFTGraph highlight_locations={data.attack_note_indices} fft_gains={data.fft_gains} />
<FFTDiffGraph fft_diffs={data.fft_diffs} />

<style>
  button {
    width: 100px;
  }
</style>