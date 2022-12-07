import { Howl } from 'howler';
import { createMachine } from 'xstate';

import { bellSound } from '../sound/bell';

/**
 * A state machine defining the operation of the engine's bell.
 */
export const bellMachine = createMachine(
  {
    id: 'bell',
    initial: 'not-ringing',
    schema: {
      context: {} as { bellSound: Howl },
      events: {} as { type: 'RING' } | { type: 'STOP' },
    },
    tsTypes: {} as import('./bellMachine.typegen').Typegen0,
    context: { bellSound },
    states: {
      ringing: {
        description: `The engine's bell is ringing.`,
        invoke: { src: 'ringing' },
        on: { STOP: { target: 'not-ringing' } },
      },
      'not-ringing': {
        description: `The engine's bell is not ringing.`,
        on: { RING: { target: 'ringing' } },
      },
    },
  },
  {
    services: {
      ringing:
        ({ bellSound }) =>
        () => {
          const bell1Id = bellSound.play();

          return () => {
            bellSound
              .loop(false, bell1Id)
              .fade(1, 0, (bellSound.duration() - bellSound.seek(bell1Id)) * 1000, bell1Id)
              .once('fade', () => {
                bellSound.stop(bell1Id);
              });
          };
        },
    },
  }
);
