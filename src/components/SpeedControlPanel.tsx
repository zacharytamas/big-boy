import cn from 'classnames';
import { PropsWithChildren } from 'react';
import { StateFrom } from 'xstate';
import { speedMachine } from '../machines/speedMachine';

interface SpeedControlPanelProps {
  speedMachine: StateFrom<typeof speedMachine>;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;
  toggleAuto: () => void;
}

const SpeedButton = ({
  children,
  onClick,
}: PropsWithChildren<{ onClick: () => void }>) => (
  <div
    className="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded border bg-gray-200 text-2xl font-bold"
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
    <div className="flex items-center rounded-lg border-4 border-black p-4 text-2xl">
      <div className="flex flex-1 items-center space-x-2 font-bold">
        <div
          onClick={toggleAuto}
          className={cn(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded border',
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
      <div className="flex flex-1 items-center space-x-2">
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
