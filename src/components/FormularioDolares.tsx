import { InputField } from './InputField';
import { Card } from './Card';
import { TRM_DEFAULT, EUR_DEFAULT, GBP_DEFAULT } from '../config/constants';
import type { InputsDolares, Moneda, NivelARL } from '../types';

const TASAS_DEFAULT: Record<Moneda, number> = {
  USD: TRM_DEFAULT,
  EUR: EUR_DEFAULT,
  GBP: GBP_DEFAULT,
};

const MONEDA_LABELS: Record<Moneda, string> = {
  USD: 'USD — Dólar',
  EUR: 'EUR — Euro',
  GBP: 'GBP — Libra',
};

interface Props {
  inputs: InputsDolares;
  onChange: (inputs: InputsDolares) => void;
}

function num(s: string) { return Math.max(0, parseFloat(s) || 0); }

export function FormularioDolares({ inputs, onChange }: Props) {
  const set = <K extends keyof InputsDolares>(k: K, v: InputsDolares[K]) =>
    onChange({ ...inputs, [k]: v });

  return (
    <div className="flex flex-col gap-4">
      {/* Moneda + TRM + tipo */}
      <Card title="Configuración general" accent="blue">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Moneda extranjera</label>
            <div className="flex gap-2">
              {(['USD', 'EUR', 'GBP'] as Moneda[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ ...inputs, moneda: m, trm: TASAS_DEFAULT[m] })}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    inputs.moneda === m
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">{MONEDA_LABELS[inputs.moneda]} — al cambiar se carga la TRM de referencia</p>
          </div>
          <InputField
            label={`TRM (COP por 1 ${inputs.moneda})`}
            value={inputs.trm}
            onChange={v => set('trm', num(v))}
            tooltip={`Tasa de cambio editable. Referencia ${inputs.moneda}: $${TASAS_DEFAULT[inputs.moneda].toLocaleString('es-CO')}. Verificar en superfinanciera.gov.co`}
            step={1}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set('tipoTrabajador', 'independiente')}
              className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                inputs.tipoTrabajador === 'independiente'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              Independiente
            </button>
            <button
              type="button"
              onClick={() => set('tipoTrabajador', 'empleado')}
              className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                inputs.tipoTrabajador === 'empleado'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              Contrato laboral
            </button>
          </div>
        </div>
      </Card>

      {/* Independiente */}
      {inputs.tipoTrabajador === 'independiente' && (
        <>
          <Card title="Ingresos" accent="blue">
            <div className="grid grid-cols-1 gap-3">
              <InputField
                label={`Ingreso mensual (${inputs.moneda})`}
                value={inputs.ingresoUSD}
                onChange={v => set('ingresoUSD', num(v))}
                tooltip={`Valor total recibido del cliente en ${inputs.moneda} antes de descuentos.`}
                step={100}
              />
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                Equivalente en COP: <strong>${(inputs.ingresoUSD * inputs.trm).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong>
              </div>
            </div>
          </Card>

          <Card title="Tipo de servicio y tributario" accent="orange">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de ingreso
                </label>
                <select
                  value={inputs.tipoServicio}
                  onChange={e => set('tipoServicio', e.target.value as 'honorarios' | 'servicios')}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-1.5 text-gray-900 dark:text-gray-100"
                >
                  <option value="honorarios">Honorarios — 10%/11% RteFte (Art. 392 ET)</option>
                  <option value="servicios">Servicios — 4%/6% RteFte (Art. 392 ET)</option>
                </select>
                <p className="text-xs text-gray-400">
                  Honorarios: prima el factor intelectual (consultoría, diseño, desarrollo, asesoría).<br/>
                  Servicios: prima el factor técnico o manual.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="declarante"
                  checked={inputs.esDeclarante}
                  onChange={e => set('esDeclarante', e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="declarante" className="text-sm text-gray-700 dark:text-gray-300">
                  Declarante de renta
                  <span className="block text-xs text-gray-400">Reduce la tarifa de RteFte (Art. 392 ET)</span>
                </label>
              </div>
              <InputField
                label="Gastos deducibles (COP)"
                value={inputs.gastosDeducibles}
                onChange={v => set('gastosDeducibles', num(v))}
                tooltip="Costos y gastos reales relacionados con la actividad (Art. 107 ET). Se restan de la base para RteFte. Si no tienes soporte, déjalo en 0."
              />
            </div>
          </Card>

          <Card title="Seguridad social" accent="purple">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-md bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                <strong>IBC = 40% del ingreso bruto</strong> (Decreto 1601/2022)<br/>
                Mínimo 1 SMMLV · Máximo 25 SMMLV · Salud 12.5% · Pensión 16%
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="arl-indep"
                  checked={inputs.afiliadoARL}
                  onChange={e => set('afiliadoARL', e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="arl-indep" className="text-sm text-gray-700 dark:text-gray-300">
                  Afiliar ARL voluntaria
                  <span className="block text-xs text-gray-400">Obligatoria si el contrato lo exige o actividad es de riesgo</span>
                </label>
              </div>
              {inputs.afiliadoARL && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel de riesgo ARL</label>
                  <select
                    value={inputs.nivelARLIndep}
                    onChange={e => set('nivelARLIndep', parseInt(e.target.value) as NivelARL)}
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-1.5 text-gray-900 dark:text-gray-100"
                  >
                    <option value={1}>I — 0.522%</option>
                    <option value={2}>II — 1.044%</option>
                    <option value={3}>III — 2.436%</option>
                    <option value={4}>IV — 4.350%</option>
                    <option value={5}>V — 6.960%</option>
                  </select>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Contrato laboral */}
      {inputs.tipoTrabajador === 'empleado' && (
        <>
          <Card title="Salario en dólares" accent="blue">
            <div className="grid grid-cols-1 gap-3">
              <InputField
                label={`Salario básico (${inputs.moneda})`}
                value={inputs.salarioUSD}
                onChange={v => set('salarioUSD', num(v))}
                tooltip={`Salario pactado en el contrato en ${inputs.moneda}. Se convierte a COP según TRM para calcular aportes.`}
                step={100}
              />
              <InputField
                label={`Otros ingresos salariales (${inputs.moneda})`}
                value={inputs.otrosIngresosUSD}
                onChange={v => set('otrosIngresosUSD', num(v))}
                tooltip="Bonos, comisiones u otros conceptos salariales adicionales."
                step={50}
              />
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                Salario COP: <strong>${((inputs.salarioUSD + inputs.otrosIngresosUSD) * inputs.trm).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong>
              </div>
            </div>
          </Card>

          <Card title="Configuración laboral" accent="purple">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="integral-usd" checked={inputs.esIntegral}
                  onChange={e => set('esIntegral', e.target.checked)} className="h-4 w-4" />
                <label htmlFor="integral-usd" className="text-sm text-gray-700 dark:text-gray-300">
                  Salario integral (≥ 13 SMMLV en COP)
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel ARL</label>
                <select value={inputs.nivelARL} onChange={e => set('nivelARL', parseInt(e.target.value) as NivelARL)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-1.5 text-gray-900 dark:text-gray-100">
                  <option value={1}>I — 0.522%</option>
                  <option value={2}>II — 1.044%</option>
                  <option value={3}>III — 2.436%</option>
                  <option value={4}>IV — 4.350%</option>
                  <option value={5}>V — 6.960%</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="ley1819-usd" checked={inputs.exoneracionLey1819}
                  onChange={e => set('exoneracionLey1819', e.target.checked)} className="h-4 w-4" />
                <label htmlFor="ley1819-usd" className="text-sm text-gray-700 dark:text-gray-300">
                  Exoneración Ley 1819/2016
                </label>
              </div>
            </div>
          </Card>

          <Card title="Depuración RteFte" accent="orange">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Personas a cargo</label>
                <select value={inputs.numeroDependientes} onChange={e => set('numeroDependientes', parseInt(e.target.value))}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-1.5 text-gray-900 dark:text-gray-100">
                  {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <InputField label="AFC + voluntarios pensión (COP)" value={inputs.aportesAFC}
                onChange={v => set('aportesAFC', num(v))} tooltip="Art. 126-1 ET: tope 30% del ingreso." />
              <InputField label="Medicina prepagada (COP)" value={inputs.medicinaPrepagada}
                onChange={v => set('medicinaPrepagada', num(v))} tooltip="Tope 16 UVT/mes. Art. 387 ET." />
              <InputField label="Intereses vivienda (COP)" value={inputs.interesesVivienda}
                onChange={v => set('interesesVivienda', num(v))} tooltip="Tope 100 UVT/mes. Art. 387 ET." />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
