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
    detector.listenFor([currentNote.freq]);
    detector.start();
    detector.onNote((note) => {
      /* if (note.pitch_num === currentNote.pitch_num) { */
        updateNote();
        /* console.log(`HIT ${note.pitch_name}`); */
      /* } else { */
        /* //displayNotes(); */
        /* console.log(`Heard ${note.pitch_name}, looking for ${currentNote.pitch_name}`); */
      /* } */
    });

  }

  function displayNotes() {
    document.querySelectorAll('#output svg').forEach((elem) => elem.remove());
    setTimeout(() => {
      const vf = new Factory({
        renderer: { elementId: 'output', width: 240, height: 240 },
      });

      let x = 20;
      let y = 10;

      function appendSystem(width: number) {
        const system = vf.System({ x, y, width, spaceBetweenStaves: 10 });
        x += width;
        return system;
      }

      const score = vf.EasyScore({ throwOnError: true });
      const voice = score.voice.bind(score);
      const notes = score.notes.bind(score);
      const beam = score.beam.bind(score);

      let system = appendSystem(198);
      system.addStave({
        voices: [
          voice(
            notes(measure.easyScore, { stem: 'up' }),
          ),
        ]
      }).addClef('treble');

      system.addStave({
        voices: [
        ]
      }).addClef('bass');

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
    console.log('next listening for', currentNote);
    detector.listenFor([currentNote.freq]);

    const svgNotes = document.querySelectorAll('.vf-stavenote');
    for (let i = 0; i < svgNotes.length; i++) {
      if (i < currentNoteIndex) {
        svgNotes[i].classList.add('played');
      } else {
        svgNotes[i].classList.remove('played');
      }

      if (i === currentNoteIndex - 1) {
        let noteHead = svgNotes[i].querySelector('.vf-notehead path');
        let ripple = noteHead.cloneNode(true);
        noteHead.parentNode.appendChild(ripple);
        let bbox = ripple.getBBox();
        let xCenter = bbox.x + bbox.width / 2;
        let yCenter = bbox.y + bbox.height / 2;
        ripple.setAttribute('transform-origin', `${xCenter} ${yCenter}`);
        ripple.classList.add('ripple');
      }
    }
  }

  onDestroy(() => {
    detector?.stop();
  });
</script>

<div id="output" class="vexflow">
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
