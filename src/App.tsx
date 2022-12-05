import { useEffect, useState } from 'react';
import cn from 'classnames';

import { useChuffing } from './sound/useChuffing';
import { useMachine } from '@xstate/react';
import { bellMachine } from './machines/bellMachine';
import SpeedControlPanel from './SpeedControlPanel';
import { speedMachine } from './machines/speedMachine';
import { whistleMachine } from './machines/whistleMachine';

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
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <SpeedControlPanel
          speedMachine={speedMachine_}
          decreaseSpeed={() => sendSpeedMachine('MANUAL_SPEED_DECREASE')}
          increaseSpeed={() => sendSpeedMachine('MANUAL_SPEED_INCREASE')}
          toggleAuto={() => {
            sendSpeedMachine(speedMachine_.matches('auto') ? 'START_STATIC' : 'START_AUTO');
          }}
        />

        <div
          className={cn('flex border rounded-lg p-4 items-center cursor-pointer', {
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
          className={cn('flex border rounded-lg p-4 items-center cursor-pointer', {
            'bg-green-100 border-green-500': bellIsRinging,
          })}
          onClick={() => {
            sendBellMachine(bellIsRinging ? `STOP` : `RING`);
          }}
        >
          <div className="flex-1 font-bold uppercase text-2xl">Bell</div>
          <div className="flex-1 text-lg">{bellIsRinging ? `Ringing` : `Not Ringing`}</div>
        </div>

        <div
          className={cn('border rounded-lg p-4 cursor-pointer text-2xl font-bold text-center', {
            'bg-red-500 animate-pulse text-white': whistleMachine_.matches('sounding'),
          })}
          onTouchDown={() => sendWhistleMachine('START')}
          onTouchUp={() => sendWhistleMachine('STOP')}
        >
          WHISTLE
        </div>
      </div>
    </div>
  );
}

export default App;
