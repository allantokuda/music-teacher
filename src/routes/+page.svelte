<script>
  import { goto } from '$app/navigation';
  /* import Detector from '$lib/detector/Detector.ts'; */

  import * as Tone from 'tone';

  function play() {
    /* let d = new Detector(); */
    /* d.start(); */
    /* d.stop(); */

    let mic = new Tone.UserMedia();
    //Tone.start()
    mic.open().then(() => {
      mic.close();
      goto('/play');
    });
  }
</script>

<div>
  <button on:click={play}>Play game!</button>
</div>

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
