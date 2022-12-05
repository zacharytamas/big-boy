import { createMachine } from 'xstate';
import { Howl } from 'howler';

interface BellContext {}

/**
 * A state machine defining the operation of the engine's bell.
 */
export const bellMachine = createMachine<BellContext>(
  {
    id: 'bell',
    initial: 'not-ringing',
    states: {
      ringing: {
        description: `The engine's bell is ringing.`,
        activities: ['ringing'],
        on: { STOP: { target: 'not-ringing' } },
      },
      'not-ringing': {
        description: `The engine's bell is not ringing.`,
        on: { RING: { target: 'ringing' } },
      },
    },
  },
  {
    activities: {
      ringing: () => {
        const bell = new Howl({ src: ['bell-2.mp3'], loop: true });
        const bell1Id = bell.play();

        return () => {
          bell
            .loop(false, bell1Id)
            .fade(1, 0, (bell.duration() - bell.seek(bell1Id)) * 1000, bell1Id)
            .once('fade', () => {
              bell.stop(bell1Id);
            });
        };
      },
    },
  }
);
