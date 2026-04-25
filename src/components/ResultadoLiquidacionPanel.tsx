import { Card } from './Card';
import { LineaResultado } from './LineaResultado';
import { formatCOP } from '../utils/format';
import type { ResultadoLiquidacion, MotivoTerminacion } from '../types';

interface Props { resultado: ResultadoLiquidacion }

const MOTIVO_LABEL: Record<MotivoTerminacion, string> = {
  renuncia: 'Renuncia voluntaria',
  despido_justa_causa: 'Despido con justa causa',
  despido_sin_justa_causa: 'Despido sin justa causa',
};

const MOTIVO_COLOR: Record<MotivoTerminacion, string> = {
  renuncia: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
  despido_justa_causa: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300',
  despido_sin_justa_causa: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300',
};

function FmtAnios({ dias }: { dias: number }) {
  const anios = Math.floor(dias / 365);
  const meses = Math.floor((dias % 365) / 30);
  const d = dias % 30;
  const partes = [];
  if (anios > 0) partes.push(`${anios} año${anios !== 1 ? 's' : ''}`);
  if (meses > 0) partes.push(`${meses} mes${meses !== 1 ? 'es' : ''}`);
  if (d > 0 || partes.length === 0) partes.push(`${d} día${d !== 1 ? 's' : ''}`);
  return <>{partes.join(', ')}</>;
}

export function ResultadoLiquidacionPanel({ resultado: r }: Props) {
  const sinCesantias = r.cesantias === 0;

  return (
    <div className="flex flex-col gap-4">

      {/* Encabezado: motivo */}
      <div className={`rounded-xl border px-4 py-3 ${MOTIVO_COLOR[r.motivoTerminacion]}`}>
        <div className="font-semibold text-sm">{MOTIVO_LABEL[r.motivoTerminacion]}</div>
        <div className="text-xs mt-0.5 opacity-75">
          Tiempo trabajado: <FmtAnios dias={r.diasTrabajados} /> ({r.diasTrabajados} días)
        </div>
      </div>

      {/* Prestaciones sociales — siempre aplican */}
      <Card title="Prestaciones sociales (toda terminación)" accent="green">
        {sinCesantias ? (
          <div className="text-xs text-gray-400 mb-2">
            Salario integral: cesantías e intereses no aplican — incluidos en el factor prestacional (Art. 132 CST).
          </div>
        ) : (
          <>
            <LineaResultado
              label="Cesantías"
              value={r.cesantias}
              tooltip="1 mes de salario + auxilio transporte por año trabajado, proporcional. Art. 249 CST."
            />
            <LineaResultado
              label="Intereses sobre cesantías (12% anual)"
              value={r.interesesCesantias}
              tooltip="12% anual sobre el saldo de cesantías, proporcional al período. Art. 1 Ley 52/1975."
            />
          </>
        )}
        <LineaResultado
          label="Prima de servicios"
          value={r.prima}
          tooltip={sinCesantias
            ? 'Integral: prima no aplica — incluida en el factor prestacional.'
            : '1 mes de salario + auxilio transporte por semestre, proporcional al tiempo. Art. 306 CST.'}
        />
        <LineaResultado
          label="Vacaciones"
          value={r.vacaciones}
          tooltip="15 días hábiles por año sobre salario básico, proporcional al tiempo trabajado. Art. 186 CST. Aplica también en salario integral."
        />
      </Card>

      {/* Indemnización */}
      <Card title="Indemnización por despido (Art. 64 CST)" accent={r.indemnizacion > 0 ? 'red' : 'blue'}>
        {r.motivoTerminacion !== 'despido_sin_justa_causa' ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">No aplica</span>
            {' — '}
            {r.motivoTerminacion === 'renuncia'
              ? 'la renuncia voluntaria no genera indemnización.'
              : 'el despido con justa causa no genera indemnización (Art. 62 CST).'}
          </div>
        ) : (
          <>
            {r.tipoContrato === 'indefinido' && (
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {r.altoSalario
                  ? 'Salario ≥ 10 SMMLV: 20 días 1er año + 15 días/año adicional'
                  : 'Salario < 10 SMMLV: 30 días 1er año + 20 días/año adicional'}
              </div>
            )}
            {r.tipoContrato === 'fijo' && (
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Equivale a los salarios del tiempo restante del contrato (Art. 64 §2 CST).
              </div>
            )}
            {r.tipoContrato === 'obra' && (
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Contrato de obra: sin tarifa legal tasada. Monto a definir judicialmente o por acuerdo.
              </div>
            )}
            <LineaResultado
              label="Indemnización"
              value={r.indemnizacion}
              bold
              tooltip="Art. 64 CST — aplica únicamente en despido sin justa causa."
            />
          </>
        )}
      </Card>

      {/* Total */}
      <Card title="Total a pagar al trabajador" accent="blue">
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
          {formatCOP(r.totalLiquidacion)}
        </div>
        <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
          {!sinCesantias && (
            <div className="flex justify-between">
              <span>Cesantías + intereses</span>
              <span className="tabular-nums">{formatCOP(r.cesantias + r.interesesCesantias)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Prima + vacaciones</span>
            <span className="tabular-nums">{formatCOP(r.prima + r.vacaciones)}</span>
          </div>
          {r.indemnizacion > 0 && (
            <div className="flex justify-between font-medium text-red-600 dark:text-red-400">
              <span>Indemnización</span>
              <span className="tabular-nums">{formatCOP(r.indemnizacion)}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Notas importantes */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 p-3 text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-1.5">
        <p><strong className="text-gray-700 dark:text-gray-300">Cesantías:</strong> para contratos {'>'}1 año el empleador deposita en el Fondo cada 14 de febrero. Este cálculo suma el total acumulado — descontar lo ya depositado si aplica.</p>
        <p><strong className="text-gray-700 dark:text-gray-300">Vacaciones:</strong> esta cifra es la <em>compensación en dinero</em> de vacaciones no disfrutadas. Si el trabajador tomó períodos de vacaciones, solo se liquida el saldo pendiente.</p>
        <p><strong className="text-gray-700 dark:text-gray-300">Salario integral:</strong> las cesantías e intereses no aplican (incluidos en el 30% factor prestacional). Las vacaciones sí se pagan siempre.</p>
        <p><strong className="text-gray-700 dark:text-gray-300">Resultado informativo.</strong> Valores definitivos pueden variar según acuerdos, deducciones autorizadas y fallos judiciales.</p>
      </div>
    </div>
  );
}
