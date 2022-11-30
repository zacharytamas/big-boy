import { Howl } from 'howler';
import { useMemo } from 'react';

interface UseChuffing {
  /** Set the current speed of the engine in meters per second. */
  setSpeed(speed: number): void;
  start(): void;
  stop(): void;
}

const slowChuffing = new Howl({ src: ['chuffing-slow.mp3'], loop: true });
let SHARED_CHUFF_ID: number;

/** A hook for controlling the sound of the chuffing of the engine. */
export const useChuffing = (): UseChuffing => {
  return {
    start: () => {
      if (!slowChuffing.playing()) {
        SHARED_CHUFF_ID = slowChuffing.play();
        slowChuffing.fade(0, 1, 250, SHARED_CHUFF_ID);
      }
    },
    stop: () => {
      if (slowChuffing.playing()) {
        slowChuffing.fade(1, 0, 1000, SHARED_CHUFF_ID).once('fade', (id) => slowChuffing.stop(id));
      }
    },
    setSpeed: (speed) => {
      const lowSpeed = 20;
      const highSpeed = 35;
      const ratio = speed / 28;

      const adjusted = Math.max(0.8, Math.min(ratio, 1.3));

      slowChuffing.rate(adjusted, SHARED_CHUFF_ID);

      console.log(adjusted);
    },
  };
};
