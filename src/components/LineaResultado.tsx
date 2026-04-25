import { formatCOP } from '../utils/format';
import { Tooltip } from './Tooltip';

interface Props {
  label: string;
  value: number;
  tooltip?: string;
  bold?: boolean;
  negative?: boolean;
}

export function LineaResultado({ label, value, tooltip, bold, negative }: Props) {
  const color = negative ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-100';
  return (
    <div className={`flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700 last:border-0 ${bold ? 'font-bold' : ''}`}>
      <span className={`text-sm ${bold ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
        {tooltip ? <Tooltip text={tooltip}>{label}</Tooltip> : label}
      </span>
      <span className={`text-sm tabular-nums ${color}`}>
        {negative && value > 0 ? '−' : ''}{formatCOP(value)}
      </span>
    </div>
  );
}
