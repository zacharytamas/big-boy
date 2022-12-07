import { useEffect, useState } from 'react';

import { useMachine } from '@xstate/react';

import BellButton from './components/BellButton';
import EngineButton from './components/EngineButton';
import WhistleButton from './components/WhistleButton';
import { bellMachine } from './machines/bellMachine';
import { speedMachine } from './machines/speedMachine';
import { whistleMachine } from './machines/whistleMachine';
import { useChuffing } from './sound/useChuffing';
import SpeedControlPanel from './SpeedControlPanel';

function App() {
  const [engineOn, setEngineOn] = useState(false);

  const chuffing = useChuffing();
  const [bell, sendBellMachine] = useMachine(bellMachine);
  const bellIsRinging = bell.matches('ringing');

  const [speedMachine_, sendSpeedMachine] = useMachine(speedMachine);

  const [whistleMachine_, sendWhistleMachine] = useMachine(whistleMachine);

  useEffect(() => {
    chuffing.setSpeed(speedMachine_.context.speed);
  }, [speedMachine_.context.speed, chuffing]);

  useEffect(() => {
    if (engineOn) {
      chuffing.start();
    } else {
      chuffing.stop();
    }
  }, [engineOn, chuffing]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          <SpeedControlPanel
            speedMachine={speedMachine_}
            decreaseSpeed={() => sendSpeedMachine('MANUAL_SPEED_DECREASE')}
            increaseSpeed={() => sendSpeedMachine('MANUAL_SPEED_INCREASE')}
            toggleAuto={() => {
              sendSpeedMachine(
                speedMachine_.matches('auto') ? 'START_STATIC' : 'START_AUTO'
              );
            }}
          />

          <EngineButton
            active={engineOn}
            toggleEngine={() => {
              setEngineOn((val) => !val);
            }}
          />

          <BellButton
            ringing={bellIsRinging}
            toggleRinging={() => {
              sendBellMachine(bellIsRinging ? `STOP` : `RING`);
            }}
          />

          <WhistleButton
            sounding={whistleMachine_.matches('sounding')}
            startSounding={() => sendWhistleMachine('START')}
            stopSounding={() => sendWhistleMachine('STOP')}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
