import cn from 'classnames';

interface BellButtonProps {
  ringing: boolean;
  toggleRinging(): void;
}

export default function BellButton({
  ringing,
  toggleRinging,
}: BellButtonProps) {
  return (
    <div
      className={cn('flex cursor-pointer items-center rounded-lg border p-4', {
        'border-green-500 bg-green-100': ringing,
      })}
      onClick={toggleRinging}
    >
      <div className="flex-1 text-2xl font-bold uppercase">Bell</div>
      <div className="flex-1 text-lg">
        {ringing ? `Ringing` : `Not Ringing`}
      </div>
    </div>
  );
}
