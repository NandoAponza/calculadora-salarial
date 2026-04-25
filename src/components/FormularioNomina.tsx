import { InputField } from './InputField';
import { Card } from './Card';
import type { InputsNomina } from '../types';
import type { NivelARL } from '../types';

interface Props {
  inputs: InputsNomina;
  onChange: (inputs: InputsNomina) => void;
}

function num(s: string) { return Math.max(0, parseFloat(s) || 0); }

export function FormularioNomina({ inputs, onChange }: Props) {
  const set = <K extends keyof InputsNomina>(k: K, v: InputsNomina[K]) =>
    onChange({ ...inputs, [k]: v });

  return (
    <div className="flex flex-col gap-4">
      <Card title="Ingresos" accent="blue">
        <div className="grid grid-cols-1 gap-3">
          <InputField
            label="Salario básico"
            value={inputs.salarioBasico}
            onChange={v => set('salarioBasico', num(v))}
            tooltip="Salario pactado en el contrato. Para 2026 el mínimo es $1.750.905."
          />
          <InputField
            label="Bonos y comisiones"
            value={inputs.bonosComisiones}
            onChange={v => set('bonosComisiones', num(v))}
            tooltip="Ingresos salariales variables. Se suman a la base de aportes y prestaciones."
          />
          <InputField
            label="HE ordinarias (25%)"
            value={inputs.horasExtrasOrdinarias}
            onChange={v => set('horasExtrasOrdinarias', num(v))}
            tooltip="Horas extra diurnas: recargo 25% sobre hora ordinaria (Art. 168 CST)."
          />
          <InputField
            label="HE nocturnas (75%)"
            value={inputs.horasExtrasNocturnas}
            onChange={v => set('horasExtrasNocturnas', num(v))}
            tooltip="Horas extra nocturnas: recargo 75% (Art. 168 CST)."
          />
          <InputField
            label="HE dominicales (100%)"
            value={inputs.horasExtrasDominicales}
            onChange={v => set('horasExtrasDominicales', num(v))}
            tooltip="Horas extra en dominicales o festivos: recargo 100% (Art. 171 CST)."
          />
          <InputField
            label="Auxilios no salariales"
            value={inputs.auxiliosNoSalariales}
            onChange={v => set('auxiliosNoSalariales', num(v))}
            tooltip="Beneficios que no constituyen salario (alimentación, rodamiento, etc.). No cotizan ni entran a base prestacional (Art. 128 CST)."
          />
        </div>
      </Card>

      <Card title="Configuración contrato" accent="purple">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="integral"
              checked={inputs.esIntegral}
              onChange={e => set('esIntegral', e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="integral" className="text-sm text-gray-700 dark:text-gray-300">
              Salario integral (≥ 13 SMMLV = $22.761.765)
              <span className="block text-xs text-gray-400">70% factor salarial / 30% factor prestacional (Art. 132 CST)</span>
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel de riesgo ARL</label>
            <select
              value={inputs.nivelARL}
              onChange={e => set('nivelARL', parseInt(e.target.value) as NivelARL)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm"
            >
              <option value={1}>I — 0.522% (oficinas, comercio)</option>
              <option value={2}>II — 1.044% (procesos leves)</option>
              <option value={3}>III — 2.436% (industria, manufactura)</option>
              <option value={4}>IV — 4.350% (construcción, minería)</option>
              <option value={5}>V — 6.960% (alto riesgo)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ley1819"
              checked={inputs.exoneracionLey1819}
              onChange={e => set('exoneracionLey1819', e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="ley1819" className="text-sm text-gray-700 dark:text-gray-300">
              Exoneración Ley 1819/2016 Art. 65
              <span className="block text-xs text-gray-400">Empleadores contribuyentes del impuesto de renta exoneran salud, SENA e ICBF para empleados &lt; 10 SMMLV</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Depuración Retención en la Fuente" accent="orange">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Personas a cargo (dependientes)
            </label>
            <select
              value={inputs.numeroDependientes}
              onChange={e => set('numeroDependientes', parseInt(e.target.value))}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2.5 text-gray-900 dark:text-gray-100"
            >
              {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <p className="text-xs text-gray-400">10% del ingreso neto, tope 32 UVT/mes ($1.675.968). Art. 387 ET</p>
          </div>
          <InputField
            label="Aportes AFC + voluntarios pensión"
            value={inputs.aportesAFC}
            onChange={v => set('aportesAFC', num(v))}
            tooltip="Cuentas AFC (ahorro para vivienda) y aportes voluntarios a pensión. Deducibles hasta el 30% del ingreso (Art. 126-1 ET)."
          />
          <InputField
            label="Aportes voluntarios pensión adicionales"
            value={inputs.aportesVoluntariosPension}
            onChange={v => set('aportesVoluntariosPension', num(v))}
            tooltip="Incluidos en el tope conjunto del 30% con AFC (Art. 126-1 ET)."
          />
          <InputField
            label="Medicina prepagada"
            value={inputs.medicinaPrepagada}
            onChange={v => set('medicinaPrepagada', num(v))}
            tooltip="Deducible hasta 16 UVT/mes ($838.984). Art. 387 ET."
          />
          <InputField
            label="Intereses crédito de vivienda"
            value={inputs.interesesVivienda}
            onChange={v => set('interesesVivienda', num(v))}
            tooltip="Intereses pagados en crédito hipotecario o leasing habitacional. Tope 100 UVT/mes ($5.237.400). Art. 387 ET."
          />
        </div>
      </Card>
    </div>
  );
}
