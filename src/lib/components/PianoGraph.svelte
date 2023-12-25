<script>
  export let note_gains = [];
  export let highlight_note_numbers = [];
  import { noteName } from '$lib/fft_processing.js';

  function noteColor(noteNum) {
    return noteName(noteNum).includes('#') ? 'black' : 'white';
  }
  function noteHighlight(noteNum, highlight_note_numbers) {
    return highlight_note_numbers.includes(noteNum) ? 'highlight' : '';
  }
</script>

<div class="piano-graph">
  {#each note_gains as gain, n}
    <div class="bar {noteColor(n)} {noteHighlight(n, highlight_note_numbers)}" style="height: {150+gain}px;">
      {noteName(n)}
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
