import { useState, useMemo } from 'react';
import { calcularDashboard } from '../calculators/dashboard';
import { formatCOP } from '../utils/format';
import { MetricaCard } from './dashboard/MetricaCard';
import { GastosConfig, crearCategoriasDefault } from './dashboard/GastosConfig';
import { GraficoDonut } from './dashboard/GraficoDonut';
import { GraficoFlujo } from './dashboard/GraficoFlujo';
import { TablaMeses } from './dashboard/TablaMeses';
import type { InputsNomina, InputsDashboard, ParamsLegales } from '../types';

interface Props { nominaInputs: InputsNomina; params: ParamsLegales }

const PERIODOS = [
  { label: '1 mes',   meses: 1  },
  { label: '3 meses', meses: 3  },
  { label: '6 meses', meses: 6  },
  { label: '1 año',   meses: 12 },
  { label: '2 años',  meses: 24 },
];

const hoy = new Date();

export function DashboardPanel({ nominaInputs, params }: Props) {
  const [categorias, setCategorias] = useState(crearCategoriasDefault);
  const [otrosIngresos, setOtrosIngresos] = useState(0);
  const [mesesProyeccion, setMesesProyeccion] = useState(12);
  const [personalizado, setPersonalizado] = useState(false);
  const mesInicio = 0;                       // siempre desde enero
  const anioInicio = hoy.getFullYear();
  const [vistaTabla, setVistaTabla] = useState(false);

  const inputs: InputsDashboard = {
    mesInicio,
    anioInicio,
    mesesProyeccion,
    categorias,
    otrosIngresos,
  };

  const resultado = useMemo(
    () => calcularDashboard(inputs, nominaInputs, params),
    [inputs, nominaInputs, params],
  );

  const { puntos, totalIngreso, totalGastos, totalAhorro, tasaAhorro, ahorroAcumuladoFinal, mesesColchon } = resultado;

  const gastosTotalesMes = categorias.reduce((s, c) => s + c.monto, 0);
  const colorAhorro = tasaAhorro < 0 ? 'red' : tasaAhorro < 10 ? 'orange' : tasaAhorro < 20 ? 'blue' : 'green';
  const colorColchon = mesesColchon < 1 ? 'red' : mesesColchon < 3 ? 'orange' : 'green';

  return (
    <div className="flex flex-col gap-5">

      {/* ── Selector de período ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mr-1">Período:</span>
        {PERIODOS.map(p => (
          <button
            key={p.meses}
            onClick={() => { setMesesProyeccion(p.meses); setPersonalizado(false); }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
              !personalizado && mesesProyeccion === p.meses
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            {p.label}
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPersonalizado(true)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
              personalizado
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            Personalizado
          </button>
          {personalizado && (
            <input
              type="number"
              min={1}
              max={60}
              value={mesesProyeccion}
              onChange={e => setMesesProyeccion(Math.min(60, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-20 rounded-md border border-blue-400 bg-white dark:bg-gray-800 text-sm px-2 py-1 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
            />
          )}
          {personalizado && <span className="text-xs text-gray-400">meses (máx 60)</span>}
        </div>
      </div>

      {/* ── Métricas principales ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricaCard
          titulo="Ingreso neto total"
          valor={formatCOP(totalIngreso)}
          sub={`${formatCOP(puntos[0]?.ingresoNomina ?? 0)}/mes promedio`}
          color="blue"
          icono="💼"
        />
        <MetricaCard
          titulo="Gastos totales"
          valor={formatCOP(totalGastos)}
          sub={`${formatCOP(gastosTotalesMes)}/mes`}
          color="red"
          icono="💸"
        />
        <MetricaCard
          titulo="Ahorro proyectado"
          valor={formatCOP(totalAhorro)}
          sub={`Tasa: ${tasaAhorro.toFixed(1)}%`}
          color={colorAhorro}
          icono="🏦"
        />
        <MetricaCard
          titulo="Colchón financiero"
          valor={`${mesesColchon.toFixed(1)} meses`}
          sub="Gastos cubiertos por ahorro acum."
          color={colorColchon}
          icono="🛡️"
        />
      </div>

      {/* ── Alerta déficit ── */}
      {totalAhorro < 0 && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
          <span className="text-lg shrink-0">⚠️</span>
          <div>
            <strong>Déficit proyectado de {formatCOP(Math.abs(totalAhorro))}</strong> en {mesesProyeccion} mes{mesesProyeccion > 1 ? 'es' : ''}.
            Los gastos superan los ingresos en {formatCOP(Math.abs(totalAhorro / mesesProyeccion))}/mes promedio.
            Revisa las categorías de gasto para ajustar.
          </div>
        </div>
      )}

      {/* ── Layout principal: config + gráficos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Columna izquierda: gastos */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              Gastos mensuales
            </h3>
            <GastosConfig
              categorias={categorias}
              onChange={setCategorias}
              otrosIngresos={otrosIngresos}
              onOtrosIngresos={setOtrosIngresos}
            />
          </div>

          {/* Donut */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Distribución de gastos
            </h3>
            <GraficoDonut categorias={categorias} ingresoTotal={puntos[0]?.ingresoTotal ?? 1} />
          </div>
        </div>

        {/* Columna derecha: gráficos */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Resumen ingreso vs gasto del mes base */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              Balance mensual base
            </h3>
            <div className="flex flex-col gap-2">
              {/* Barra proporcional ingreso vs gasto */}
              {(() => {
                const ingBase = puntos[0]?.ingresoNomina + otrosIngresos || 1;
                const pctGasto = Math.min((gastosTotalesMes / ingBase) * 100, 100);
                const pctAhorro = Math.max(100 - pctGasto, 0);
                const deficit = gastosTotalesMes > ingBase;
                return (
                  <>
                    <div className="flex h-7 rounded-full overflow-hidden">
                      <div className="bg-red-400 dark:bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${pctGasto}%`, minWidth: pctGasto > 0 ? 8 : 0 }}>
                        {pctGasto > 8 ? `${pctGasto.toFixed(0)}%` : ''}
                      </div>
                      {!deficit && (
                        <div className="bg-green-500 dark:bg-green-600 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${pctAhorro}%` }}>
                          {pctAhorro > 8 ? `${pctAhorro.toFixed(0)}%` : ''}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 py-2 px-1">
                        <div className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatCOP(ingBase)}</div>
                        <div className="text-gray-400">Ingreso mensual</div>
                      </div>
                      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 py-2 px-1">
                        <div className="font-bold text-red-500 tabular-nums">{formatCOP(gastosTotalesMes)}</div>
                        <div className="text-gray-400">Gastos</div>
                      </div>
                      <div className={`rounded-lg py-2 px-1 ${deficit ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                        <div className={`font-bold tabular-nums ${deficit ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {deficit ? '' : '+'}{formatCOP(ingBase - gastosTotalesMes)}
                        </div>
                        <div className="text-gray-400">Ahorro/mes</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Gráfico flujo */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              Proyección de ingresos, gastos y ahorro acumulado
            </h3>
            <GraficoFlujo puntos={puntos} />
            <p className="text-xs text-gray-400 mt-2">
              Las barras moradas marcan los meses con prima de servicios (jun/dic). La línea amarilla es el ahorro acumulado.
            </p>
          </div>

          {/* Toggle tabla */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Detalle mes a mes
              </h3>
              <button
                onClick={() => setVistaTabla(v => !v)}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                {vistaTabla ? 'Ocultar' : 'Ver tabla'}
              </button>
            </div>
            {vistaTabla && <TablaMeses puntos={puntos} />}
            {!vistaTabla && (
              <p className="text-xs text-gray-400">
                Haz clic en "Ver tabla" para el desglose mes a mes con prima e intereses de cesantías destacados.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
