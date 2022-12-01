import { Subject } from 'rxjs';
import { useEffect } from 'react';

let WATCH_ID: number;
const sharedPositionSubject = new Subject<GeolocationPosition>();

export const usePosition = () => {
  useEffect(() => {
    if (!WATCH_ID) {
      // If there is no registered watch, we need to create one.
      WATCH_ID = navigator.geolocation.watchPosition(
        (position) => {
          console.log('Geolocation position', position);
          sharedPositionSubject.next(position);
        },
        (error) => {
          console.log('Geolocation error', error);
          // TODO Handle errors
        },
        { enableHighAccuracy: true }
      );
    }

    // TODO This ensures that there is only ever one Watch registered for the
    // position and is shared by all hooks that call usePosition() but currently this
    // never actually clears the `watchPosition` on un-render.
  }, []);

  return sharedPositionSubject;
};
