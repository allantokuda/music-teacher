<script>
  import { noteIndices } from '$lib/noteMap'
  export let highlight_locations = [];
  export let fft_gains = [];

  function barColor(i, highlight_locations, noteIndices) {
    return highlight_locations.includes(i) ? 'red' :
           noteIndices.includes(i) ? 'gray' : '';
  }
</script>

<div class="graph">
  {#each fft_gains.slice(0,400) as gain, i}
    <div class="bar {barColor(i, highlight_locations, noteIndices)}"
         style="height: {250+gain}px;">
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
