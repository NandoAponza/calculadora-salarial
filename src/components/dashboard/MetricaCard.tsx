interface Props {
  titulo: string;
  valor: string;
  sub?: string;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'gray';
  icono?: string;
}

const colores = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
  green:  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
  red:    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300',
  orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300',
  gray:   'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
};

export function MetricaCard({ titulo, valor, sub, color = 'gray', icono }: Props) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-1 ${colores[color]}`}>
      <div className="flex items-center gap-2">
        {icono && <span className="text-xl">{icono}</span>}
        <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{titulo}</span>
      </div>
      <div className="text-xl font-bold tabular-nums leading-tight">{valor}</div>
      {sub && <div className="text-xs opacity-60">{sub}</div>}
    </div>
  );
}
