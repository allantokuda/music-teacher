<script lang="ts">
  import { pitchIndices } from '$lib/pitch'
  export let fft_diffs = [];
  let history: number[][] = [];
  let diffSum: number[] = [];
  $: {
    history.push(fft_diffs.slice(0,400));
    if (history.length > 10) {
      history.shift();
      diffSum = history.reduce((sums,momentaries) => {
        if (!sums) {
          return momentaries;
        }
        return sums.map((sum,i) => sum + momentaries[i]);
      }, null);
      //console.log(diffSum);
    }
  }
</script>

<div class="graph">
{#if diffSum.length > 0}
  {#each diffSum as diff, i}
    <div class="bar {pitchIndices.includes(i) ? 'pitch' : ''} {diff > 0 ? 'up' : 'down'}" style="height: {Math.abs(diff)}px;">
    </div>
  {/each}
{/if}
{ fft_diffs.slice(0,400).reduce((a,b) => a+b, 0) > 300 }
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
  .bar.pitch {
    background-color: red;
  }
  .bar.down {
    background-color: blue;
  }
</style>
