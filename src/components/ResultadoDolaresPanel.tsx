import { Card } from './Card';
import { LineaResultado } from './LineaResultado';
import { formatCOP, fmtMoneda } from '../utils/format';
import { SMMLV } from '../config/constants';
import type { Moneda, ResultadoIndependienteUSD, ResultadoEmpleadoUSD } from '../types';

function DualValor({ cop, ext, moneda }: { cop: number; ext: number; moneda: Moneda }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatCOP(cop)}</span>
      <span className="text-xs tabular-nums text-gray-400">{fmtMoneda(ext, moneda)}</span>
    </div>
  );
}

interface PropsIndep {
  resultado: ResultadoIndependienteUSD;
}

export function ResultadoIndependientePanel({ resultado: r }: PropsIndep) {
  const ibcTag = r.ibcMinAplicado
    ? ' (mín aplicado = 1 SMMLV)'
    : r.ibcMaxAplicado
    ? ' (máx aplicado = 25 SMMLV)'
    : '';

  return (
    <div className="flex flex-col gap-4">
      <Card title="Ingresos" accent="blue">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">Ingreso bruto</span>
          <DualValor cop={r.ingresoBrutoCOP} ext={r.ingresoBrutoUSD} moneda={r.moneda} />
        </div>
        <div className="text-xs text-gray-400 pt-1">TRM: 1 {r.moneda} = ${r.trm.toLocaleString('es-CO', { maximumFractionDigits: 2 })} COP</div>
      </Card>

      <Card title="Seguridad social (a cargo del independiente)" accent="purple">
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          IBC: <strong>{formatCOP(r.ibc)}</strong> ({r.ibcEnSMMLV.toFixed(2)} SMMLV){ibcTag}
        </div>
        <LineaResultado label="Salud (12.5% del IBC)" value={r.saludCOP} negative
          tooltip="El independiente paga la totalidad: equivalente a empleado (4%) + empleador (8.5%). Art. 204 Ley 100 · Decreto 1601/2022." />
        <LineaResultado label="Pensión (16% del IBC)" value={r.pensionCOP} negative
          tooltip="El independiente paga la totalidad: empleado (4%) + empleador (12%). Art. 7 Ley 797/2003." />
        {r.fspCOP > 0 && (
          <LineaResultado label="FSP — Fondo Solidaridad Pensional" value={r.fspCOP} negative
            tooltip="Aplica cuando el IBC supera 4 SMMLV. Tasa escalonada. Art. 27 Ley 100/93." />
        )}
        {r.arlCOP > 0 && (
          <LineaResultado label="ARL voluntaria" value={r.arlCOP} negative
            tooltip="Aporte voluntario según nivel de riesgo (Decreto 1607/2002)." />
        )}
        <LineaResultado
          label="Total seguridad social"
          value={r.saludCOP + r.pensionCOP + r.fspCOP + r.arlCOP}
          bold negative
        />
      </Card>

      <Card title="Retención en la fuente" accent="orange">
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          Base (ingreso − gastos deducibles): <strong>{formatCOP(r.baseRteFte)}</strong>
        </div>
        <LineaResultado label="Retención Art. 392 ET" value={r.retencionFuenteCOP} negative
          tooltip="Honorarios: 10% (declarante) / 11% (no declarante). Servicios: 4%/6%. El agente de retención es quien te paga." />
      </Card>

      <Card title="Neto estimado" accent="green">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCOP(r.netoCOP)}</div>
            <div className="text-base font-semibold text-green-500 dark:text-green-300">{fmtMoneda(r.netoUSD, r.moneda)}</div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <div>Descuentos totales:</div>
            <div className="font-medium text-red-400">{formatCOP(r.totalDescuentosCOP)}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded p-2">
          Este neto es estimado. El impuesto definitivo se liquida en la declaración de renta anual. La RteFte aplicada por el pagador es un anticipo del impuesto.
        </div>
      </Card>

      <Card title="Comparativo bruto vs neto" accent="blue">
        {[
          { label: 'Ingreso bruto', pct: 100, color: 'bg-blue-500' },
          {
            label: 'Seguridad social',
            pct: ((r.saludCOP + r.pensionCOP + r.fspCOP + r.arlCOP) / r.ingresoBrutoCOP) * 100,
            color: 'bg-purple-400',
          },
          {
            label: 'RteFte',
            pct: (r.retencionFuenteCOP / r.ingresoBrutoCOP) * 100,
            color: 'bg-orange-400',
          },
          { label: 'Neto', pct: (r.netoCOP / r.ingresoBrutoCOP) * 100, color: 'bg-green-500' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 py-1">
            <span className="text-xs w-36 text-gray-600 dark:text-gray-300 shrink-0">{item.label}</span>
            <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(item.pct, 100)}%` }} />
            </div>
            <span className="text-xs tabular-nums w-10 text-right text-gray-600 dark:text-gray-300">{item.pct.toFixed(1)}%</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

interface PropsEmpleado {
  resultado: ResultadoEmpleadoUSD;
}

export function ResultadoEmpleadoUSDPanel({ resultado: r }: PropsEmpleado) {
  const n = r.nomina;
  return (
    <div className="flex flex-col gap-4">
      <Card title="Salario convertido a COP" accent="blue">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">Salario básico</span>
          <DualValor cop={r.salarioCOP} ext={r.salarioUSD} moneda={r.moneda} />
        </div>
        <div className="text-xs text-gray-400 mt-1">TRM: 1 {r.moneda} = ${r.trm.toLocaleString('es-CO', { maximumFractionDigits: 2 })} COP</div>
      </Card>

      <Card title="Deducciones empleado" accent="red">
        <LineaResultado label="Salud (4%)" value={n.saludEmpleado} negative />
        <LineaResultado label="Pensión (4%)" value={n.pensionEmpleado} negative />
        {n.fsp > 0 && <LineaResultado label="FSP" value={n.fsp} negative />}
        <LineaResultado label="Retención en la fuente" value={n.retencionFuente} negative
          tooltip="Art. 383 ET: tabla progresiva sobre base depurada mensual." />
        <LineaResultado label="Total deducciones" value={n.totalDeducciones + n.retencionFuente} bold negative />
      </Card>

      <Card title="Neto empleado" accent="green">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCOP(r.netoCOP)}</div>
            <div className="text-base font-semibold text-green-500 dark:text-green-300">{fmtMoneda(r.netoUSD, r.moneda)}</div>
          </div>
          <div className="text-xs text-gray-400 text-right">
            <div>Auxilio transporte</div>
            <div className="font-medium">{formatCOP(n.auxilioTransporte)}</div>
          </div>
        </div>
      </Card>

      <Card title="Carga empleador" accent="orange">
        <LineaResultado label="Salud empleador" value={n.saludEmpleador} />
        <LineaResultado label="Pensión empleador (12%)" value={n.pensionEmpleador} />
        <LineaResultado label="ARL" value={n.arl} />
        <LineaResultado label="SENA" value={n.sena} />
        <LineaResultado label="ICBF" value={n.icbf} />
        <LineaResultado label="Caja Compensación" value={n.caja} />
        <LineaResultado label="Total carga empleador" value={n.totalCargaEmpleador} bold />
      </Card>

      <Card title="Prestaciones causadas / mes" accent="purple">
        <LineaResultado label="Cesantías" value={n.cesantiasMes} />
        <LineaResultado label="Intereses cesantías" value={n.interesesCesantiasMes} />
        <LineaResultado label="Prima" value={n.primaMes} />
        <LineaResultado label="Vacaciones" value={n.vacacionesMes} />
        <LineaResultado label="Total prestaciones" value={n.totalPrestaciones} bold />
      </Card>

      <Card title="Costo total empresa" accent="blue">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCOP(r.costoEmpresaCOP)}</div>
            <div className="text-sm font-semibold text-blue-400">{fmtMoneda(r.costoEmpresaUSD, r.moneda)}</div>
          </div>
          <div className="text-xs text-gray-400 text-right">
            <div>Razón costo/neto</div>
            <div className="font-medium">{(r.costoEmpresaCOP / r.netoCOP).toFixed(2)}x</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
