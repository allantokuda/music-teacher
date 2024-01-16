<script>
  import { pitchIndices } from '$lib/pitch'
  export let highlight_locations = [];
  export let fft_gains = [];

  function barColor(i, highlight_locations, pitchIndices) {
    if (highlight_locations.includes(i)) {
      return 'red';
    } else if (pitchIndices.includes(i)) {
      return 'gray';
    /* } else if (i % 100 === 0) { */
    /*   return 'gray'; */
    }
  }
</script>

<div class="graph">
  {#each fft_gains.slice(0,1200) as gain, i}
    <div class="bar {barColor(i, highlight_locations, pitchIndices)}"
         style="height: {20+gain}px;">
    </div>
  {/each}
</div>

<style>
  .graph {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 70px;
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
    background-color: #999;
  }
</style>
