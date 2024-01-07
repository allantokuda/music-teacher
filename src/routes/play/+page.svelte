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
  let currentNoteIndex = 0;
  let currentNote = measure.notes[currentNoteIndex];
  let heardNote = null;

  if (browser) {
    displayNotes();

    detector = new Detector();
    detector.start();
    detector.onNote((note) => {
      if (note.pitch_num === currentNote.pitch_num) {
        updateNote();
        console.log(`HIT ${note.pitch_name}`);
      } else {
        //displayNotes();
        console.log(`Heard ${note.pitch_name}, looking for ${currentNote.pitch_name}`);
      }
    });

  }

  function displayNotes() {
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
    currentNoteIndex = (currentNoteIndex + 1) % 4 // loop back to beginning for now
    if (currentNoteIndex === 0) {
      measure = composer.writeMeasure();
      displayNotes();
    }
    currentNote = measure.notes[currentNoteIndex];

    const svgNotes = document.querySelectorAll('.vf-stavenote');
    for (let i = 0; i < svgNotes.length; i++) {
      if (i < currentNoteIndex) {
        svgNotes[i].classList.add('played');
      } else {
        svgNotes[i].classList.remove('played');
      }
    }
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
