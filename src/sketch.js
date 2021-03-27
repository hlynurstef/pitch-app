const model_url = "http://localhost:8000/model";
let pitch;
let mic;
let freq = 0;
let threshold = 1;
let micIsOn = false;
const NOTE_NAMES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];
let noteToPlay;
const width = 400;
const height = 400;
const canvasDiagonal = width * Math.sqrt(2);

function pickNewRandomNote() {
  const pickedNote = NOTE_NAMES[Math.floor(Math.random() * NOTE_NAMES.length)];
  if (pickedNote !== noteToPlay) {
    return pickedNote;
  } else {
    return pickNewRandomNote();
  }
}

$("#button").on("click", handleButtonClick);

function setup() {
  let canvas = createCanvas(width, height);
  canvas.center();
  noteToPlay = pickNewRandomNote();
}

function frequencyToNote(f) {
  const n = 69 + 12 * Math.log2(f / 440.0);
  const nRound = Math.round(n);
  const cents = Math.floor((n.toFixed(2) - nRound) * 100);
  // console.log(n, nRound, cents);
  // const cents = (n/12 - 1).toString();
  return [NOTE_NAMES[nRound % 12], cents];
}

function handleButtonClick(event) {
  if (!micIsOn) {
    mic = new p5.AudioIn();
    mic.start(listening);
    getAudioContext().resume();
    $("#button").text("Stop Listening");
    micIsOn = true;
  } else {
    mic.stop();
    getAudioContext().suspend();
    $("#button").text("Start Listening");
    micIsOn = false;
  }
}

function listening() {
  console.log("listening");
  pitch = ml5.pitchDetection(
    model_url,
    getAudioContext(),
    mic.stream,
    modelLoaded
  );
}

let pickNewNote = false;
let ellipseWidth = 0;

function draw() {
  background(0);
  fill(255);

  if (micIsOn) {
    // const [noteName, cents] = frequencyToNote(freq);
    textSize(64);
    textAlign(CENTER, CENTER);
    text(noteToPlay, width / 2, height / 2);

    // Render the note to guess
    if (freq) {
      const [noteName, cents] = frequencyToNote(freq);
      if (noteName === noteToPlay) {
        pickNewNote = true;
      }
    }

    // Animate circle and pick a new note
    if (pickNewNote) {
      // fill screen in 0.25 second
      ellipseWidth = ellipseWidth + ((100 / 0.4) * deltaTime) / 1000;
      // console.log(ellipseWidth);
      fill(255, 255, 255);
      ellipse(
        width / 2,
        height / 2,
        lerp(0, canvasDiagonal + 20, ellipseWidth / 100)
      );
      if (ellipseWidth >= 100) {
        pickNewNote = false;
        ellipseWidth = 0;
        noteToPlay = pickNewRandomNote();
        freq = 0;
      }
    }
  }
}

function modelLoaded() {
  console.log("model loaded");
  pitch.getPitch(gotPitch);
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    if (frequency) {
      freq = frequency;
    }
    pitch.getPitch(gotPitch);
  }
}
