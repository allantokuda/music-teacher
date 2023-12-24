<script>
  import { noteIndices } from '$lib/fft_processing.js'
  export let fft_gains = [];
</script>

<div class="graph">
  {#each fft_gains.slice(0,400) as gain, i}
    <div class="bar {noteIndices.includes(i) ? 'note' : ''}" style="height: {150+gain}px;">
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
  .bar.note {
    background-color: red;
  }
</style>
