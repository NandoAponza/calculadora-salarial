import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCOP } from '../../utils/format';
import type { CategoriaGasto } from '../../types';

interface Props {
  categorias: CategoriaGasto[];
  ingresoTotal: number;
}

export function GraficoDonut({ categorias, ingresoTotal }: Props) {
  const data = categorias.filter(c => c.monto > 0).map(c => ({
    name: `${c.emoji} ${c.nombre}`,
    value: c.monto,
    color: c.color,
    pct: ingresoTotal > 0 ? (c.monto / ingresoTotal) * 100 : 0,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Agrega gastos para ver la distribución
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number, name: string) => [formatCOP(v), name]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend
          formatter={(value, entry: any) =>
            `${value} (${entry.payload.pct.toFixed(1)}%)`
          }
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
