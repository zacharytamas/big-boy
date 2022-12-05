import { createMachine, assign, spawn, type InvokeCallback, type Actor } from 'xstate';

const MILES_PER_HOUR_IN_METERS_PER_SECOND = 0.44704;
const DEFAULT_SPEED = 20.5;

export const speedMachine = createMachine(
  {
    schema: {
      context: {} as { speed: number; geoActorRef?: Actor },
      events: {} as
        | { type: 'START_AUTO' }
        | { type: 'START_STATIC' }
        | { type: 'SET_SPEED'; speed: number }
        | { type: 'MANUAL_SPEED_INCREASE' }
        | { type: 'MANUAL_SPEED_DECREASE' },
    },
    tsTypes: {} as import('./speedMachine.typegen').Typegen0,
    id: 'speed',
    initial: 'static',
    context: { speed: DEFAULT_SPEED },
    on: { START_AUTO: 'auto', START_STATIC: 'static' },
    states: {
      auto: {
        entry: assign({ geoActorRef: () => spawn(geoSpeedInvocable) }),
        on: { SET_SPEED: { actions: 'setSpeed' } },
      },
      static: {
        on: {
          MANUAL_SPEED_INCREASE: { actions: 'manualSpeedIncrease' },
          MANUAL_SPEED_DECREASE: { actions: 'manualSpeedDecrease' },
        },
      },
    },
  },
  {
    actions: {
      setSpeed: assign({ speed: (_, event) => event.speed }),
      manualSpeedIncrease: assign({
        speed: (context) => context.speed + MILES_PER_HOUR_IN_METERS_PER_SECOND,
      }),
      manualSpeedDecrease: assign({
        speed: (context) => context.speed - MILES_PER_HOUR_IN_METERS_PER_SECOND,
      }),
    },
  }
);

const geoSpeedInvocable: InvokeCallback = (send) => {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (position.coords.speed) {
        send({ type: 'SET_SPEED', speed: position.coords.speed });
      }
    },
    (error) => {},
    { enableHighAccuracy: true }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
};
