<script>
  import { pitchIndices } from '$lib/pitch'
  export let highlight_locations = [];
  export let fft_gains = [];

  function barColor(i, highlight_locations, pitchIndices) {
    return highlight_locations.includes(i) ? 'red' :
           pitchIndices.includes(i) ? 'gray' : '';
  }
</script>

<div class="graph">
  {#each fft_gains.slice(0,1200) as gain, i}
    <div class="bar {barColor(i, highlight_locations, pitchIndices)}"
         style="height: {gain}px;">
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
    width: 1px;
    border: none;
    min-height: 0px;
    text-align: center;
    display: inline-block;
    overflow-wrap: anywhere;
    background-color: black;
  }
  .bar.red {
    background-color: red;
  }
  .bar.gray {
    background-color: gray;
  }
</style>
