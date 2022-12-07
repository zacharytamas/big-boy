import { Howl } from 'howler';
import { createMachine } from 'xstate';

import { whistleSound } from '../sound/whistle';

export const whistleMachine = createMachine(
  {
    schema: {
      context: {} as { whistleSound: Howl },
      events: {} as { type: 'START' } | { type: 'STOP' },
    },
    tsTypes: {} as import('./whistleMachine.typegen').Typegen0,
    context: { whistleSound },
    id: 'whistle',
    initial: 'idle',
    states: {
      idle: {
        on: { START: 'sounding' },
      },
      sounding: {
        invoke: { src: 'sounding' },
        on: { STOP: 'idle' },
      },
    },
  },
  {
    services: {
      sounding:
        ({ whistleSound }) =>
        () => {
          const loopStartId = whistleSound.play('loopStart');
          let loopId: number;

          whistleSound.once(
            'end',
            () => {
              loopId = whistleSound.play('loop');
            },
            loopStartId
          );

          return () => {
            whistleSound.stop(loopId).play('loopEnd');
          };
        },
    },
  }
);
