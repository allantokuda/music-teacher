<script>
  import { noteIndices } from '../functions/noteMap.js'
  export let fft_diffs = [];
</script>

<div class="graph">
{#each fft_diffs.slice(0,400) as diff, i}
  <div class="bar {noteIndices.includes(i) ? 'note' : ''} {diff > 0 ? 'up' : 'down'}" style="height: {Math.abs(diff)*10}px;">
  </div>
{/each}
</div>


<style>
  .graph {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 100px;
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
  .bar.note {
    background-color: red;
  }
  .bar.down {
    background-color: blue;
  }
</style>
