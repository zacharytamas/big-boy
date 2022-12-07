import { useEffect, useState } from 'react';

import cn from 'classnames';

import { useMachine } from '@xstate/react';

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

          <div
            className={cn(
              'flex cursor-pointer items-center rounded-lg border p-4',
              {
                'border-green-500 bg-green-100': engineOn,
              }
            )}
            onClick={() => {
              setEngineOn((val) => !val);
            }}
          >
            <div className="flex-1 text-2xl font-bold uppercase">Engine</div>
            <div className="flex-1 text-lg">
              {engineOn ? `Running` : `Not Running`}
            </div>
          </div>

          <div
            className={cn(
              'flex cursor-pointer items-center rounded-lg border p-4',
              {
                'border-green-500 bg-green-100': bellIsRinging,
              }
            )}
            onClick={() => {
              sendBellMachine(bellIsRinging ? `STOP` : `RING`);
            }}
          >
            <div className="flex-1 text-2xl font-bold uppercase">Bell</div>
            <div className="flex-1 text-lg">
              {bellIsRinging ? `Ringing` : `Not Ringing`}
            </div>
          </div>

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
