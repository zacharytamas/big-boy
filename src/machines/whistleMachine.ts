import { Actor, createMachine } from 'xstate';
import { whistleSound } from '../sound/whistle';

export const whistleMachine = createMachine({
  schema: {
    context: {} as { whistleActorRef?: Actor },
    events: {} as { type: 'START' } | { type: 'STOP' },
  },
  tsTypes: {} as import('./whistleMachine.typegen').Typegen0,
  id: 'whistle',
  initial: 'idle',
  states: {
    idle: {
      on: { START: 'sounding' },
    },
    sounding: {
      invoke: {
        src: (context, event) => (send) => {
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
      on: { STOP: 'idle' },
    },
  },
});
