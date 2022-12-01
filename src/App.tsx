import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Howl } from 'howler';

import { useChuffing } from './sound/useChuffing';
import { useSpeed } from './streams/useSpeed';

function App() {
  const [speed, setSpeed] = useState<number>(0);

  const [bellActive, setBellActive] = useState(false);

  const chuffing = useChuffing();
  const speed$ = useSpeed();

  const bellSound = useMemo(() => {
    return new Howl({ src: 'bell.mp3', loop: true });
  }, []);

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
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            setBellActive(true);
          }}
        >
          Start Bell
        </button>
        <button
          onClick={() => {
            setBellActive(false);
          }}
        >
          Stop Bell
        </button>
        <button
          onClick={() => {
            chuffing.start();
          }}
        >
          Start chuffing
        </button>
        <button
          onClick={() => {
            chuffing.stop();
          }}
        >
          Stop chuffing
        </button>

        <h1>Speed</h1>
        <p>{`${speed} m/s`}</p>
      </header>
    </div>
  );
}

export default App;
