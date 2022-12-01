import { useEffect } from 'react';
import { filter, map, Observable, scan, Subject } from 'rxjs';
import { usePosition } from './usePosition';

const WINDOW_SIZE = 3;
const sharedSpeedSubject = new Subject<number>();

export const useSpeed = (): Observable<number> => {
  const position$ = usePosition();

  useEffect(() => {
    position$
      .pipe(
        filter((pos) => pos.coords.speed !== null),
        scan((acc, pos) => [...acc.slice(0, WINDOW_SIZE - 1), pos.coords.speed!], [] as number[]),
        map((window) => window.reduce((a, b) => a + b, 0) / window.length)
      )
      .subscribe((speed) => {
        sharedSpeedSubject.next(speed);
      });
  }, [position$]);

  return sharedSpeedSubject;
};
