<script>
  export let pitch_gains = [];
  export let highlight_pitch_numbers = [];
  import { pitchName } from '$lib/pitch';

  function pitchColor(pitchNum) {
    return pitchName(pitchNum).includes('#') ? 'black' : 'white';
  }
  function pitchHighlight(pitchNum, highlight_pitch_numbers) {
    return highlight_pitch_numbers.includes(pitchNum) ? 'highlight' : '';
  }
</script>

<div class="piano-graph">
  {#each pitch_gains as gain, n}
    <div class="bar {pitchColor(n)} {pitchHighlight(n, highlight_pitch_numbers)}" style="height: {240+gain}px;">
      {pitchName(n)}
    </div>
  {/each}
</div>

<style>
  .piano-graph {
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
  .bar.black {
    background-color: black;
    color: white;
  }
  .bar.white {
    background-color: white;
    color: black;
  }
  .bar.highlight {
    background-color: red;
  }
</style>
