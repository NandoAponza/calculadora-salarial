import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { formatCOP } from '../../utils/format';
import type { PuntoDashboard } from '../../types';

interface Props { puntos: PuntoDashboard[] }

export function GraficoFlujo({ puntos }: Props) {
  const label = (p: PuntoDashboard) =>
    puntos.length <= 12 ? p.mes : `${p.mes} ${String(p.anio).slice(2)}`;

  const data = puntos.map(p => ({
    ...p,
    label: label(p),
    ingresoBase: p.ingresoNomina + p.otrosIngresos,
    extras: p.primaEfectiva + p.intCesantias,
  }));

  const fmt = (v: number) => formatCOP(v);
  const fmtY = (v: number) => `$${(v / 1_000_000).toFixed(1)}M`;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={fmtY} tick={{ fontSize: 10 }} />
        <Tooltip formatter={fmt} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />

        <Bar dataKey="ingresoBase" name="Ingreso neto nómina" stackId="ing" fill="#3b82f6" radius={[0,0,0,0]} />
        <Bar dataKey="extras" name="Prima / Int. cesantías" stackId="ing" fill="#a855f7" radius={[3,3,0,0]} />
        <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[3,3,0,0]} />
        <Line type="monotone" dataKey="ahorroAcumulado" name="Ahorro acumulado" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
