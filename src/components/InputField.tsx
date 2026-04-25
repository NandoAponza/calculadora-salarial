import { Tooltip } from './Tooltip';

interface Props {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
  tooltip?: string;
  type?: string;
  min?: number;
  step?: number;
  prefix?: string;
}

export function InputField({ label, value, onChange, tooltip, type = 'number', min = 0, step = 1000, prefix }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {tooltip ? <Tooltip text={tooltip}>{label}</Tooltip> : label}
      </label>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
        <input
          type={type}
          value={value}
          min={type === 'number' ? min : undefined}
          step={type === 'number' ? step : undefined}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
