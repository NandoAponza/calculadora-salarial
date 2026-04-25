import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { Card } from './Card';
import { formatCOP } from '../utils/format';
import { calcularProyeccionAnual } from '../calculators/proyeccion';
import type { InputsNomina, ParamsLegales } from '../types';

interface Props { inputs: InputsNomina; params: ParamsLegales }

export function ProyeccionAnualPanel({ inputs, params }: Props) {
  const { puntos, totalNeto, totalNetoConExtras, totalBruto, totalCostoEmpresa } =
    calcularProyeccionAnual(inputs, params);

  const formatter = (v: number) => formatCOP(v);
  const hayPrima = puntos.some(p => p.primaEfectiva > 0);
  const hayIntCesantias = puntos.some(p => p.intCesantiasEfectivos > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Resumen anual */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card title="Total bruto anual" accent="blue">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCOP(totalBruto)}</div>
        </Card>
        <Card title="Neto salarial anual" accent="green">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatCOP(totalNeto)}</div>
          <div className="text-xs text-gray-400 mt-0.5">Sin prima ni int. cesantías</div>
        </Card>
        <Card title="Neto total recibido" accent="green">
          <div className="text-lg font-bold text-green-500 dark:text-green-300">{formatCOP(totalNetoConExtras)}</div>
          <div className="text-xs text-gray-400 mt-0.5">Incluye prima + int. cesantías</div>
        </Card>
        <Card title="Costo empresa anual" accent="orange">
          <div className="text-lg font-bold text-orange-500 dark:text-orange-400">{formatCOP(totalCostoEmpresa)}</div>
        </Card>
      </div>

      {/* Aviso clarificador */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 text-xs text-blue-700 dark:text-blue-300 flex flex-col gap-1">
        <span>
          <strong>Jun y Dic:</strong> incluyen prima de servicios semestral (15 días de salario + auxilio transporte — Art. 306 CST).
        </span>
        <span>
          <strong>Ene:</strong> incluye intereses sobre cesantías del año anterior (12% anual — Art. 1 Ley 52/1975).
        </span>
        <span className="text-blue-500 dark:text-blue-400">
          Las cesantías se consignan al Fondo cada 14 de febrero; no aparecen como flujo mensual.
        </span>
      </div>

      {/* Gráfico neto mensual con extras destacados */}
      <Card title="Flujo neto mensual recibido por el empleado" accent="blue">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={puntos} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
            <RTooltip formatter={formatter} />
            <Legend />
            <Bar dataKey="neto" name="Neto salarial" fill="#22c55e" stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="primaEfectiva" name="Prima de servicios" fill="#a855f7" stackId="a" radius={[0,0,0,0]} />
            <Bar dataKey="intCesantiasEfectivos" name="Int. cesantías" fill="#f59e0b" stackId="a" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Bruto vs Neto total */}
      <Card title="Bruto vs Neto total recibido" accent="blue">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={puntos} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
            <RTooltip formatter={formatter} />
            <Legend />
            <Bar dataKey="bruto" name="Bruto" fill="#3b82f6" radius={[3,3,0,0]} />
            <Bar dataKey="netoTotal" name="Neto total" fill="#22c55e" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Costo empresa */}
      <Card title="Costo total empresa por mes" accent="orange">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={puntos} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
            <RTooltip formatter={formatter} />
            <Legend />
            <Line type="monotone" dataKey="costoEmpresa" name="Costo empresa" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="prestaciones" name="Prestaciones causadas" stroke="#a855f7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
