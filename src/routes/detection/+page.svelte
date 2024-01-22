<script lang="ts">
  import { browser } from '$app/environment';
  import Detector from '$lib/detector/Detector.ts';

  import PianoGraph from '$lib/detector/components/PianoGraph.svelte';
  import FFTGraph from '$lib/detector/components/FFTGraph.svelte';
  import FFTDiffGraph from '$lib/detector/components/FFTDiffGraph.svelte';

  let detector;
  let data = {};
  let isListening = false;
  let buttonLabel = 'Start';
  let pitch_indices = [];

  if (browser) {
    detector = new Detector();
    detector.listenFor([440]);
    detector.onFFTData((returnData) => {
      data = returnData;
    });
  }

  function start() {
    detector.start();
    pitch_indices = detector.pitchIndices;
    isListening = true;
  }

  function stop() {
    detector.stop();
    isListening = false;
  }

  function toggle() {
    if (isListening) {
      stop();
      buttonLabel = 'Start';
    } else {
      start();
      buttonLabel = 'Stop';
    }
  }

</script>

<div class="controls">
  <button on:click={toggle}>
    {buttonLabel}
  </button>
</div>

<PianoGraph pitch_gains={data.pitch_gains} />
<FFTGraph pitch_indices={pitch_indices} highlight_locations={data.attack_fft_indices} fft_gains={data.fft_gains} />
<FFTGraph pitch_indices={pitch_indices} highlight_locations={data.attack_fft_indices} fft_gains={data.fft_gains_minus_peaks} />
<FFTDiffGraph fft_diffs={data.fft_diffs} />

<style>
  button {
    width: 100px;
  }
</style>