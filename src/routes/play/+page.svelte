<script>
  import { browser } from '$app/environment';
  import Vex from 'vexflow';
  import Detector from '$lib/detector/Detector.ts';
  import { onDestroy } from 'svelte';
  import { randomNote } from '$lib/detector/functions/noteMap.ts';
  const { Factory, EasyScore, System } = Vex.Flow;

  let detector;
  let currentNote = randomNote();
  let heardNote = null;

  if (browser) {
    displayNote();

    detector = new Detector();
    detector.start();
    detector.onNote((note) => {
      if (note.note_num === currentNote.note_num) {
        updateNote();
        console.log(`HIT ${note.note_name}`);
      } else {
        //displayNote();
        console.log(`Heard ${note.note_name}, looking for ${currentNote.note_name}`);
      }
    });

  }

  function displayNote() {
    document.querySelectorAll('#output svg').forEach((elem) => elem.remove());
    setTimeout(() => {
      const vf = new Factory({
        renderer: { elementId: 'output', width: 500, height: 200 },
      });

      const score = vf.EasyScore();
      const system = vf.System();

      let note_code = `${currentNote.note_name}/w`;
      let voices = [
        score.voice(score.notes(note_code, { stem: 'up' })),
      ];
      /* if (heardNote) { */
      /*   heard_note_code = `${heardNote.note_name}/w`; */
      /*   voices.push(score.voice(score.notes(heard_note_code, { stem: 'down' }))); */
      /* } */
      system
        .addStave({ voices })
        .addClef('treble')

      vf.draw();
    });
  }

  function updateNote() {
    currentNote = randomNote();
    displayNote();
  }

  onDestroy(() => {
    detector?.stop();
  });
</script>

<div id="output">
  <span class="hidden">{currentNote.note_name}</span>
</div>

<style>
  .hidden { display: none; }
</style>
