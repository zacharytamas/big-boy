import { createMachine, assign } from 'xstate';

/**
 * The speed is denominated in meters per second but is shown to the user in MPH.
 * When the user adjusts the speed manually, they expect to adjust according to the
 * unit they are seeing so this ratio allows us to adjust the underlying value
 * accordingly.
 */
const MILES_PER_HOUR_IN_METERS_PER_SECOND = 0.44704;
/** The default speed of the locomotive in meters per second. This is about 45 MPH. */
const DEFAULT_SPEED = 20.5;

export const speedMachine = createMachine(
  {
    schema: {
      context: {} as { speed: number },
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
        invoke: { src: 'geoSpeed' },
        on: {
          SET_SPEED: { actions: 'setSpeed' },
        },
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
    services: {
      geoSpeed: () => (send) => {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (position.coords.speed) {
              send({ type: 'SET_SPEED', speed: position.coords.speed });
            }
          },
          (_error) => {
            // TODO For now it seems reasonable to just do nothing if there is an
            // error: in that case the speed stays set as it was before: it's
            // effectively a no-op.
          },
          { enableHighAccuracy: true }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      },
    },
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
