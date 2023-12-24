<script>
  export let note_gains = [];

  function noteColor(noteNum) {
    return noteName(noteNum).includes('#') ? 'black' : 'white';
  }
  function noteName(noteNum) {
    return ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][noteNum % 12]
  }
</script>

<div class="piano-graph">
  {#each note_gains as gain, n}
    <div class="bar {noteColor(n)}" style="height: {150+gain}px;">
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
</style>
