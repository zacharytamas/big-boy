import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { Howl } from 'howler';

import { useChuffing } from './sound/useChuffing';
import { useSpeed } from './streams/useSpeed';

function App() {
  const [speed, setSpeed] = useState<number>(0);

  const [engineOn, setEngineOn] = useState(false);
  const [bellActive, setBellActive] = useState(false);

  const chuffing = useChuffing();
  const speed$ = useSpeed();

  const bellSound = useMemo(() => {
    return new Howl({ src: 'bell.mp3', loop: true });
  }, []);

  useEffect(() => {
    if (engineOn) {
      chuffing.start();
    } else {
      chuffing.stop();
    }
  }, [engineOn, chuffing]);

  useEffect(() => {
    speed$.subscribe((speed_) => {
      setSpeed(speed_);
      chuffing.setSpeed(speed_);
    });
  }, [chuffing, speed$]);

  useEffect(() => {
    if (bellActive) {
      if (!bellSound.playing()) {
        bellSound.play();
        bellSound.fade(0, 1, 500);
      }
    } else {
      bellSound.fade(bellSound.volume(), 0, 500);
      bellSound.once('fade', () => bellSound.stop());
    }
  }, [bellActive, bellSound]);

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex border-black rounded-lg border-4 p-4 text-2xl">
          <div className="flex-1 font-bold">SPEED</div>
          <div className="flex-1">{`${(speed * 2.237).toFixed(0)} MPH`}</div>
        </div>

        <div
          className={cn('flex border rounded-lg p-4 items-center', {
            'bg-green-100 border-green-500': engineOn,
          })}
          onClick={() => {
            setEngineOn((val) => !val);
          }}
        >
          <div className="flex-1 font-bold uppercase text-2xl">Engine</div>
          <div className="flex-1 text-lg">{engineOn ? `Running` : `Not Running`}</div>
        </div>

        <div
          className={cn('flex border rounded-lg p-4 items-center', {
            'bg-green-100 border-green-500': bellActive,
          })}
          onClick={() => {
            setBellActive((val) => !val);
          }}
        >
          <div className="flex-1 font-bold uppercase text-2xl">Bell</div>
          <div className="flex-1 text-lg">{bellActive ? `Ringing` : `Not Ringing`}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
