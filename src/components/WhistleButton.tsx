import cn from 'classnames';

import { hasTouchEvents } from '../utils';

interface WhistleButtonProps {
  sounding: boolean;
  startSounding(): void;
  stopSounding(): void;
}

export default function WhistleButton({
  sounding,
  startSounding,
  stopSounding,
}: WhistleButtonProps) {
  const supportsTouch = hasTouchEvents();
  const handlers = {
    [supportsTouch ? 'onTouchStart' : 'onMouseDown']: startSounding,
    [supportsTouch ? 'onTouchEnd' : 'onMouseUp']: stopSounding,
  };

  return (
    <div
      className={cn(
        `cursor-pointer select-none`,
        `rounded-lg border p-4 text-center text-2xl font-bold`,
        { 'animate-pulse bg-red-500 text-white': sounding }
      )}
      {...handlers}
    >
      WHISTLE
    </div>
  );
}
