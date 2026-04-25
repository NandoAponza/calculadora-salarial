import { InputField } from './InputField';
import { Card } from './Card';
import type { InputsLiquidacion, MotivoTerminacion, TipoContrato, NivelARL } from '../types';

interface Props {
  inputs: InputsLiquidacion;
  onChange: (inputs: InputsLiquidacion) => void;
}

function num(s: string) { return Math.max(0, parseFloat(s) || 0); }

const MOTIVOS: { id: MotivoTerminacion; label: string; desc: string; color: string }[] = [
  {
    id: 'renuncia',
    label: 'Renuncia voluntaria',
    desc: 'El trabajador termina el contrato por decisión propia.',
    color: 'blue',
  },
  {
    id: 'despido_justa_causa',
    label: 'Despido con justa causa',
    desc: 'El empleador termina el contrato por una causa legal (Art. 62 CST).',
    color: 'orange',
  },
  {
    id: 'despido_sin_justa_causa',
    label: 'Despido sin justa causa',
    desc: 'El empleador termina el contrato sin causa legal — genera indemnización (Art. 64 CST).',
    color: 'red',
  },
];

const COLOR_ACTIVE: Record<string, string> = {
  blue:   'bg-blue-600 text-white border-blue-600',
  orange: 'bg-orange-500 text-white border-orange-500',
  red:    'bg-red-600 text-white border-red-600',
};

export function FormularioLiquidacion({ inputs, onChange }: Props) {
  const set = <K extends keyof InputsLiquidacion>(k: K, v: InputsLiquidacion[K]) =>
    onChange({ ...inputs, [k]: v });

  const motivoActivo = MOTIVOS.find(m => m.id === inputs.motivoTerminacion)!;

  return (
    <div className="flex flex-col gap-4">

      {/* ── Motivo de terminación — lo más importante ── */}
      <Card title="Motivo de terminación del vínculo laboral" accent="blue">
        <div className="flex flex-col gap-2">
          {MOTIVOS.map(m => {
            const activo = inputs.motivoTerminacion === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => set('motivoTerminacion', m.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-colors ${
                  activo
                    ? COLOR_ACTIVE[m.color]
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium text-sm">{m.label}</div>
                <div className={`text-xs mt-0.5 ${activo ? 'opacity-80' : 'text-gray-400 dark:text-gray-500'}`}>
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Aviso según motivo */}
        {inputs.motivoTerminacion === 'renuncia' && (
          <div className="mt-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
            En renuncia el trabajador recibe: cesantías · intereses · prima · vacaciones.
            <strong> No hay indemnización.</strong>
          </div>
        )}
        {inputs.motivoTerminacion === 'despido_justa_causa' && (
          <div className="mt-3 rounded-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 px-3 py-2 text-xs text-orange-700 dark:text-orange-300">
            Con justa causa el trabajador recibe: cesantías · intereses · prima · vacaciones.
            <strong> No hay indemnización</strong> (Art. 62 CST — el empleador debe probar la causa).
          </div>
        )}
        {inputs.motivoTerminacion === 'despido_sin_justa_causa' && (
          <div className="mt-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-3 py-2 text-xs text-red-700 dark:text-red-300">
            Sin justa causa el trabajador recibe: cesantías · intereses · prima · vacaciones
            <strong> + indemnización Art. 64 CST</strong>. El monto depende del tipo de contrato y el salario.
          </div>
        )}
      </Card>

      {/* ── Datos del contrato ── */}
      <Card title="Datos del contrato" accent="purple">
        <div className="grid grid-cols-1 gap-3">
          <InputField
            label="Salario básico"
            value={inputs.salarioBasico}
            onChange={v => set('salarioBasico', num(v))}
            tooltip="Salario pactado en el contrato. Base para cesantías, prima, vacaciones e indemnización."
          />
          <InputField
            label="Bonos y comisiones (salariales)"
            value={inputs.bonosComisiones}
            onChange={v => set('bonosComisiones', num(v))}
            tooltip="Ingresos salariales variables. Entran a la base prestacional."
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de contrato</label>
            <select
              value={inputs.tipoContrato}
              onChange={e => set('tipoContrato', e.target.value as TipoContrato)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-1.5 text-gray-900 dark:text-gray-100"
            >
              <option value="indefinido">Término indefinido</option>
              <option value="fijo">Término fijo</option>
              <option value="obra">Obra o labor</option>
            </select>
          </div>

          {inputs.tipoContrato === 'fijo' && (
            <InputField
              label="Duración pactada del contrato fijo (meses)"
              value={inputs.mesesContratoFijo}
              onChange={v => set('mesesContratoFijo', num(v))}
              tooltip="Necesario para calcular la indemnización (salarios del tiempo restante) en despido sin justa causa (Art. 64 CST §2)."
              step={1}
            />
          )}

          {inputs.tipoContrato === 'obra' && inputs.motivoTerminacion === 'despido_sin_justa_causa' && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
              Para contrato de obra o labor no existe tarifa legal de indemnización tasada. El monto se pacta o se define judicialmente. Esta calculadora muestra $0 — consultar con un abogado laboral.
            </div>
          )}

          <InputField
            label="Fecha de ingreso"
            value={inputs.fechaIngreso}
            onChange={v => set('fechaIngreso', v)}
            type="date"
          />
          <InputField
            label="Fecha de liquidación"
            value={inputs.fechaLiquidacion}
            onChange={v => set('fechaLiquidacion', v)}
            type="date"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="integral-liq"
              checked={inputs.esIntegral}
              onChange={e => set('esIntegral', e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="integral-liq" className="text-sm text-gray-700 dark:text-gray-300">
              Salario integral (≥ 13 SMMLV)
              <span className="block text-xs text-gray-400">Integral no genera cesantías ni prima; las vacaciones sí aplican (Art. 132 CST).</span>
            </label>
          </div>
        </div>
      </Card>

    </div>
  );
}
