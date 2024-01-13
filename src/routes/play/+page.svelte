<script lang="ts">
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
        renderer: { elementId: 'output', width: 200, height: 200 },
      });

      let x = 0;
      let y = 0;

      function appendSystem(width: number) {
        const system = vf.System({ x, y, width, spaceBetweenStaves: 10 });
        x += width;
        return system;
      }

      const score = vf.EasyScore({ throwOnError: true });
      const voice = score.voice.bind(score);
      const notes = score.notes.bind(score);
      const beam = score.beam.bind(score);

      let system = appendSystem(200);
      system.addStave({
        voices: [
          voice(
            notes(measure.easyScore, { stem: 'up' }),
          ),
        ]
      }).addClef('treble');

      // Playing with adding a 2nd measure later
      /* system = appendSystem(150); */
      /* system.addStave({ */
      /*   voices: [ */
      /*     voice( */
      /*       notes(measure.easyScore, { stem: 'up' }), */
      /*     ), */
      /*   ] */
      /* }); */

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
  #output {
    height: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
