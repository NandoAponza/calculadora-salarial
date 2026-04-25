import { useState, useMemo } from 'react';
import { FormularioNomina } from './FormularioNomina';
import { formatCOP } from '../utils/format';
import { calcularNomina } from '../calculators/nomina';
import { SMMLV, PARAMS_LEGALES_2026 } from '../config/constants';
import type { InputsNomina, ResultadoNomina, ParamsLegales } from '../types';

const defaultA: InputsNomina = {
  salarioBasico: SMMLV,
  bonosComisiones: 0,
  horasExtrasOrdinarias: 0,
  horasExtrasNocturnas: 0,
  horasExtrasDominicales: 0,
  auxiliosNoSalariales: 0,
  esIntegral: false,
  nivelARL: 1,
  exoneracionLey1819: true,
  numeroDependientes: 0,
  aportesAFC: 0,
  aportesVoluntariosPension: 0,
  medicinaPrepagada: 0,
  interesesVivienda: 0,
};

const defaultB: InputsNomina = {
  ...defaultA,
  salarioBasico: SMMLV * 3,
};

interface FilaComparacion {
  label: string;
  a: number;
  b: number;
  negativo?: boolean;
  destacada?: boolean;
}

function Delta({ delta, pct }: { delta: number; pct: number }) {
  if (delta === 0) return <span className="text-gray-400 tabular-nums">—</span>;
  const color = delta > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const signo = delta > 0 ? '+' : '';
  return (
    <span className={`tabular-nums font-medium ${color}`}>
      {signo}{formatCOP(delta)}
      <span className="text-xs ml-1 opacity-75">({signo}{pct.toFixed(1)}%)</span>
    </span>
  );
}

function buildFilas(a: ResultadoNomina, b: ResultadoNomina): FilaComparacion[] {
  return [
    { label: 'Salario básico', a: a.salarioBasico, b: b.salarioBasico },
    { label: 'Total devengado', a: a.totalDevengado, b: b.totalDevengado },
    { label: 'Salud empleado (4%)', a: a.saludEmpleado, b: b.saludEmpleado, negativo: true },
    { label: 'Pensión empleado (4%)', a: a.pensionEmpleado, b: b.pensionEmpleado, negativo: true },
    { label: 'FSP', a: a.fsp, b: b.fsp, negativo: true },
    { label: 'Retención en la fuente', a: a.retencionFuente, b: b.retencionFuente, negativo: true },
    { label: 'Neto empleado', a: a.netoEmpleado, b: b.netoEmpleado, destacada: true },
    { label: 'Carga empleador total', a: a.totalCargaEmpleador, b: b.totalCargaEmpleador },
    { label: 'Prestaciones / mes', a: a.totalPrestaciones, b: b.totalPrestaciones },
    { label: 'Costo total empresa', a: a.costoTotalEmpresa, b: b.costoTotalEmpresa, destacada: true },
  ];
}

interface Props { params?: ParamsLegales }

export function ComparadorPanel({ params = PARAMS_LEGALES_2026 }: Props) {
  const [inputsA, setInputsA] = useState<InputsNomina>(defaultA);
  const [inputsB, setInputsB] = useState<InputsNomina>(defaultB);
  const [editando, setEditando] = useState<'A' | 'B'>('A');

  const resA = useMemo(() => calcularNomina(inputsA, params), [inputsA, params]);
  const resB = useMemo(() => calcularNomina(inputsB, params), [inputsB, params]);

  const filas = buildFilas(resA, resB);

  return (
    <div className="flex flex-col gap-6">
      {/* Tabla de comparación */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Comparación</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-2 text-gray-500 dark:text-gray-400 font-medium w-52">Concepto</th>
                <th className="text-right px-4 py-2 text-blue-600 dark:text-blue-400 font-semibold">Escenario A</th>
                <th className="text-right px-4 py-2 text-purple-600 dark:text-purple-400 font-semibold">Escenario B</th>
                <th className="text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Diferencia (B − A)</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => {
                const delta = fila.b - fila.a;
                const pct = fila.a !== 0 ? (delta / Math.abs(fila.a)) * 100 : 0;
                const bgClass = fila.destacada
                  ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold'
                  : i % 2 === 0
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-gray-50/60 dark:bg-gray-700/30';
                return (
                  <tr key={fila.label} className={`border-b border-gray-100 dark:border-gray-700/50 ${bgClass}`}>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{fila.label}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-blue-700 dark:text-blue-300">
                      {fila.a === 0 && !fila.destacada ? <span className="text-gray-300 dark:text-gray-600">—</span> : formatCOP(fila.a)}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-purple-700 dark:text-purple-300">
                      {fila.b === 0 && !fila.destacada ? <span className="text-gray-300 dark:text-gray-600">—</span> : formatCOP(fila.b)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Delta delta={delta} pct={pct} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor de escenario */}
      <div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setEditando('A')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
              editando === 'A'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            Editar Escenario A
          </button>
          <button
            onClick={() => setEditando('B')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
              editando === 'B'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400'
            }`}
          >
            Editar Escenario B
          </button>
          <button
            onClick={() => { setInputsB({ ...inputsA }); setEditando('B'); }}
            className="ml-auto px-3 py-2 rounded-md text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 transition-colors"
          >
            Copiar A → B
          </button>
        </div>

        <div className="max-w-lg">
          {editando === 'A'
            ? <FormularioNomina inputs={inputsA} onChange={setInputsA} />
            : <FormularioNomina inputs={inputsB} onChange={setInputsB} />
          }
        </div>
      </div>
    </div>
  );
}
