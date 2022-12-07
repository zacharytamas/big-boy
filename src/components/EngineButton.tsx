import cn from 'classnames';

interface EngineButtonProps {
  active: boolean;
  toggleEngine(): void;
}

export default function EngineButton({
  active,
  toggleEngine,
}: EngineButtonProps) {
  return (
    <div
      className={cn('flex cursor-pointer items-center rounded-lg border p-4', {
        'border-green-500 bg-green-100': active,
      })}
      onClick={toggleEngine}
    >
      <div className="flex-1 text-2xl font-bold uppercase">Engine</div>
      <div className="flex-1 text-lg">{active ? `Running` : `Not Running`}</div>
    </div>
  );
}
