<script>
  import { browser } from '$app/environment';
  import Vex from 'vexflow';
  import Detector from '$lib/detector/Detector.ts';
  import { onDestroy } from 'svelte';
  import Composer from '$lib/composer/Composer';
  const { Factory, EasyScore, System } = Vex.Flow;

  let detector;
  let composer = new Composer();
  let measure = composer.writeMeasure();
  let currentNote = measure.notes[0];
  let heardNote = null;

  if (browser) {
    displayNote();

    detector = new Detector();
    detector.start();
    detector.onNote((note) => {
      if (note.pitch_num === currentNote.pitch_num) {
        updateNote();
        console.log(`HIT ${note.pitch_name}`);
      } else {
        //displayNote();
        console.log(`Heard ${note.pitch_name}, looking for ${currentNote.pitch_name}`);
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

      let note_code = `${currentNote.pitch_name}/w`;
      let voices = [
        score.voice(score.notes(measure.easyScore, { stem: 'up' })),
      ];
      /* if (heardNote) { */
      /*   heard_note_code = `${heardNote.pitch_name}/w`; */
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
  <span class="hidden">{currentNote.pitch_name}</span>
</div>

<style>
  .hidden { display: none; }
</style>
