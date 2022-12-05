import { Howl } from 'howler';

const START_GAP = 30;
const START_LENGTH = 240;
const LOOP_LENGTH = 300;
const END_LENGTH = 1000;

export const whistleSound = new Howl({
  src: 'whistle-whole.mp3',
  sprite: {
    loopStart: [START_GAP, START_LENGTH],
    loop: [START_GAP + START_LENGTH, LOOP_LENGTH, true],
    loopEnd: [START_GAP + START_LENGTH + LOOP_LENGTH, END_LENGTH],
  },
});
