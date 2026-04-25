interface Props {
  title: string;
  children: React.ReactNode;
  accent?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const accents = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  orange: 'border-orange-400',
  red: 'border-red-400',
  purple: 'border-purple-500',
};

export function Card({ title, children, accent = 'blue' }: Props) {
  return (
    <div className={`rounded-lg border-l-4 ${accents[accent]} bg-white dark:bg-gray-800 shadow-sm p-4`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}
