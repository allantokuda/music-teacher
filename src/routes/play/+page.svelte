<script lang="ts">
  import Vex from 'vexflow';
  import Detector from '$lib/detector/Detector.ts';
  import { onDestroy } from 'svelte';
  import Composer from '$lib/composer/Composer';
  const { Factory } = Vex.Flow;

  let detector;
  let composer = new Composer();
  let measure = composer.writeMeasure();
  let currentNoteIndex = 0;
  let currentNote = measure.notes[currentNoteIndex];
  let heardNote = null;

  let buttonLabel = 'Play!';
  let isListening = false;

  let debugInfo = [];

  function start() {
    displayNotes();

    detector = new Detector();
    detector.listenFor([currentNote.freq]);
    detector.start();
    isListening = true;
    detector.onDebugInfo((info) => {
      debugInfo.push(info);
      if (debugInfo.length > 10) {
        debugInfo.shift();
      }
      debugInfo = debugInfo; // for svelte
      console.log(debugInfo);
    });
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
          //voice(
            //notes(measure.easyScore, { stem: 'up' }),
          //),
        ]
      }).addClef('treble');

      system.addStave({
        voices: [
          voice(
            notes(measure.easyScore, { stem: 'up', clef: 'bass' }),
          )
        ]
      }).addClef('bass');

      vf.draw();
    });
  }

  function updateNote() {
    const svgNotes = document.querySelectorAll('.vf-stavenote');
    const note = svgNotes[currentNoteIndex]
    note.classList.add('played');

    let noteHead = note.querySelector('.vf-notehead path');
    let ripple = noteHead.cloneNode(true);
    noteHead.parentNode.appendChild(ripple);
    let bbox = ripple.getBBox();
    let xCenter = bbox.x + bbox.width / 2;
    let yCenter = bbox.y + bbox.height / 2;
    ripple.setAttribute('transform-origin', `${xCenter} ${yCenter}`);
    ripple.classList.add('ripple');

    setTimeout(() => {
      currentNoteIndex = (currentNoteIndex + 1) % 4 // loop back to beginning for now
      if (currentNoteIndex === 0) {
        measure = composer.writeMeasure();
        displayNotes();
      }
      currentNote = measure.notes[currentNoteIndex];
      console.log('next listening for', currentNote);
      detector.listenFor([currentNote.freq]);
    }, 400);
  }

  onDestroy(() => {
    stop();
  });

  function stop() {
    detector?.stop();
    isListening = false;
  }

  function toggle() {
    if (isListening) {
      stop();
      buttonLabel = 'Resume';
    } else {
      start();
      buttonLabel = 'Pause';
    }
  }
</script>

<div id="output" class="vexflow" class:hidden={!isListening}>
  <span class="hidden">{currentNote.pitch_name}</span>
</div>

<div class="controls">
  <button on:click={toggle} class:startButton={!isListening} class:stopButton={isListening}>
    {buttonLabel}
  </button>
</div>
<!--
<div class="debug-info">
  {#each debugInfo as info}
    <p>{info}</p>
  {/each}
</div>
-->

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
  .debug-info p {
    font-size: 12px;
    margin: 0;
    line-height: 1;
  }
  .startButton {
    margin: auto;
    width: 80vw;
    height: 80vh;
    font-size: 50px;
    background: none;
    border: none;
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background-color: rgba(255,255,255,0.9);
  }
  .stopButton {
    position: absolute;
    right: 0px;
    top: 0px;
    max-width: 100px;
    padding: 20px 30px;
    border: none;
    background: none;
  }
</style>
