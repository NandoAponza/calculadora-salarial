import { useState, useMemo } from 'react';
import { FormularioNomina } from './components/FormularioNomina';
import { FormularioLiquidacion } from './components/FormularioLiquidacion';
import { FormularioDolares } from './components/FormularioDolares';
import { DashboardPanel } from './components/DashboardPanel';
import { ResultadoNominaPanel } from './components/ResultadoNominaPanel';
import { ResultadoLiquidacionPanel } from './components/ResultadoLiquidacionPanel';
import { ResultadoIndependientePanel, ResultadoEmpleadoUSDPanel } from './components/ResultadoDolaresPanel';
import { ProyeccionAnualPanel } from './components/ProyeccionAnualPanel';
import { ComparadorPanel } from './components/ComparadorPanel';
import { HistoricoPanel } from './components/HistoricoPanel';
import { PanelParamsLegales } from './components/PanelParamsLegales';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdatePrompt } from './components/UpdatePrompt';
import { calcularNomina } from './calculators/nomina';
import { calcularLiquidacion } from './calculators/liquidacion';
import { calcularIndependienteUSD, calcularEmpleadoUSD } from './calculators/dolares';
import { SMMLV, TRM_DEFAULT, PARAMS_LEGALES_2026 } from './config/constants';
import { cargarHistorico, guardarEntrada, eliminarEntrada } from './utils/historico';
import type { InputsNomina, InputsLiquidacion, InputsDolares, EntradaHistorico, ParamsLegales } from './types';

type Tab = 'nomina' | 'liquidacion' | 'proyeccion' | 'dolares' | 'dashboard' | 'comparador' | 'historico';

const defaultNomina: InputsNomina = {
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

const today = new Date().toISOString().slice(0, 10);
const defaultLiquidacion: InputsLiquidacion = {
  ...defaultNomina,
  fechaIngreso: '2023-01-01',
  fechaLiquidacion: today,
  tipoContrato: 'indefinido',
  mesesContratoFijo: 12,
  motivoTerminacion: 'renuncia',
};

const defaultDolares: InputsDolares = {
  moneda: 'USD',
  trm: TRM_DEFAULT,
  tipoTrabajador: 'independiente',
  // Independiente
  ingresoUSD: 3000,
  tipoServicio: 'honorarios',
  esDeclarante: true,
  gastosDeducibles: 0,
  afiliadoARL: false,
  nivelARLIndep: 1,
  // Empleado
  salarioUSD: 3000,
  otrosIngresosUSD: 0,
  esIntegral: false,
  nivelARL: 1,
  exoneracionLey1819: true,
  numeroDependientes: 0,
  aportesAFC: 0,
  aportesVoluntariosPension: 0,
  medicinaPrepagada: 0,
  interesesVivienda: 0,
};

export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<Tab>('nomina');
  const [nominaInputs, setNominaInputs] = useState<InputsNomina>(defaultNomina);
  const [liquidacionInputs, setLiquidacionInputs] = useState<InputsLiquidacion>(defaultLiquidacion);
  const [dolaresInputs, setDolaresInputs] = useState<InputsDolares>(defaultDolares);
  const [historico, setHistorico] = useState<EntradaHistorico[]>(() => cargarHistorico());
  const [params, setParams] = useState<ParamsLegales>(() => ({ ...PARAMS_LEGALES_2026 }));

  const resultadoNomina = useMemo(() => calcularNomina(nominaInputs, params), [nominaInputs, params]);
  const resultadoLiquidacion = useMemo(() => calcularLiquidacion(liquidacionInputs, params), [liquidacionInputs, params]);
  const resultadoIndepUSD = useMemo(() => calcularIndependienteUSD(dolaresInputs, params), [dolaresInputs, params]);
  const resultadoEmpleadoUSD = useMemo(() => calcularEmpleadoUSD(dolaresInputs, params), [dolaresInputs, params]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'nomina', label: 'Nómina mensual' },
    { id: 'liquidacion', label: 'Liquidación definitiva' },
    { id: 'proyeccion', label: 'Proyección anual' },
    { id: 'dolares', label: '💵 Divisas' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'comparador', label: '⚖️ Comparador' },
    { id: 'historico', label: `📋 Histórico${historico.length > 0 ? ` (${historico.length})` : ''}` },
  ];

  const handleGuardarHistorico = () => {
    setHistorico(guardarEntrada(nominaInputs, resultadoNomina));
  };

  const handleEliminarHistorico = (id: string) => {
    setHistorico(eliminarEntrada(id));
  };

  const handleCargarHistorico = (inputs: InputsNomina) => {
    setNominaInputs(inputs);
    setTab('nomina');
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-blue-700 dark:text-blue-400">Calculadora Salarial Colombia</h1>
            <p className="text-xs text-gray-400">Valores vigentes 2026 · SMMLV $1.750.905 · UVT $52.374</p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg"
            aria-label="Cambiar tema"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 overflow-x-auto">
          <nav className="flex gap-0 min-w-max">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Panel parámetros legales */}
        <PanelParamsLegales params={params} onChange={setParams} />

        {/* Content */}
        <main className="max-w-7xl mx-auto p-4">
          {tab === 'nomina' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Formulario</h2>
                <FormularioNomina inputs={nominaInputs} onChange={setNominaInputs} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Resultados</h2>
                <ResultadoNominaPanel resultado={resultadoNomina} inputs={nominaInputs} onGuardar={handleGuardarHistorico} />
              </div>
            </div>
          )}

          {tab === 'liquidacion' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Datos del contrato</h2>
                <FormularioLiquidacion inputs={liquidacionInputs} onChange={setLiquidacionInputs} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Liquidación</h2>
                <ResultadoLiquidacionPanel resultado={resultadoLiquidacion} />
              </div>
            </div>
          )}

          {tab === 'proyeccion' && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Proyección anual — basada en parámetros de nómina mensual
              </h2>
              <ProyeccionAnualPanel inputs={nominaInputs} params={params} />
            </div>
          )}

          {tab === 'dashboard' && (
            <DashboardPanel nominaInputs={nominaInputs} params={params} />
          )}

          {tab === 'dolares' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Parámetros
                </h2>
                <FormularioDolares inputs={dolaresInputs} onChange={setDolaresInputs} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Resultados
                </h2>
                {dolaresInputs.tipoTrabajador === 'independiente'
                  ? <ResultadoIndependientePanel resultado={resultadoIndepUSD} />
                  : <ResultadoEmpleadoUSDPanel resultado={resultadoEmpleadoUSD} />
                }
              </div>
            </div>
          )}

          {tab === 'comparador' && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Comparador de escenarios — nómina mensual
              </h2>
              <ComparadorPanel params={params} />
            </div>
          )}

          {tab === 'historico' && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Histórico de nóminas guardadas
              </h2>
              <HistoricoPanel
                entradas={historico}
                onEliminar={handleEliminarHistorico}
                onCargar={handleCargarHistorico}
              />
            </div>
          )}
        </main>

        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          Calculadora informativa · Valores 2026: SMMLV Decreto 1469/2025 · UVT Resolución DIAN 000238/2025 · TRM Superfinanciera · Actualizar anualmente
        </footer>
      </div>
      <InstallPrompt />
      <UpdatePrompt />
    </div>
  );
}
