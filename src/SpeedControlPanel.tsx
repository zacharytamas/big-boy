import cn from 'classnames';
import { PropsWithChildren } from 'react';
import { StateFrom } from 'xstate';
import { speedMachine } from './machines/speedMachine';

interface SpeedControlPanelProps {
  speedMachine: StateFrom<typeof speedMachine>;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;
  toggleAuto: () => void;
}

const SpeedButton = ({ children, onClick }: PropsWithChildren<{ onClick: () => void }>) => (
  <div
    className="border rounded font-bold text-2xl bg-gray-200 w-10 h-10 flex items-center justify-center cursor-pointer select-none"
    onClick={onClick}
  >
    {children}
  </div>
);

/**
 * The control panel for showing the current speed of the engine and manipulating it
 * manually if desired.
 */
export default function SpeedControlPanel({
  speedMachine,
  decreaseSpeed,
  increaseSpeed,
  toggleAuto,
}: SpeedControlPanelProps) {
  const speedInMPH = Math.floor(speedMachine.context.speed * 2.237);

  // TODO Re-add automatic speed adjustments.

  return (
    <div className="flex border-black rounded-lg border-4 p-4 text-2xl items-center">
      <div className="flex-1 font-bold flex items-center space-x-2">
        <div
          onClick={toggleAuto}
          className={cn(
            'rounded h-10 w-10 flex items-center justify-center cursor-pointer border',
            {
              'bg-gray-500': speedMachine.matches('static'),
              'bg-blue-700': speedMachine.matches('auto'),
            }
          )}
        >
          ✨
        </div>
        <div>SPEED</div>
      </div>
      <div className="flex-1 flex space-x-2 items-center">
        {speedMachine.can('MANUAL_SPEED_DECREASE') ? (
          <SpeedButton onClick={decreaseSpeed}>-</SpeedButton>
        ) : null}
        <div className="text-lg">{speedInMPH} mph</div>
        {speedMachine.can('MANUAL_SPEED_INCREASE') ? (
          <SpeedButton onClick={increaseSpeed}>+</SpeedButton>
        ) : null}
      </div>
    </div>
  );
}
