import { Card } from './Card';
import { LineaResultado } from './LineaResultado';
import { formatCOP } from '../utils/format';
import { exportarPDF } from '../utils/pdf';
import type { ResultadoNomina } from '../types';
import type { InputsNomina } from '../types';

interface Props {
  resultado: ResultadoNomina;
  inputs: InputsNomina;
  onGuardar?: () => void;
}

export function ResultadoNominaPanel({ resultado, inputs, onGuardar }: Props) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ inputs, resultado }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nomina-2026.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card title="Ingresos" accent="blue">
        <LineaResultado label="Salario básico" value={resultado.salarioBasico} />
        <LineaResultado label="Otros ingresos" value={resultado.otrosIngresos} />
        <LineaResultado label="Auxilio transporte" value={resultado.auxilioTransporte}
          tooltip="Aplica a empleados que devenguen ≤ 2 SMMLV. No es salario (Art. 2 Ley 15/1959)." />
        <LineaResultado label="Auxilios no salariales" value={inputs.auxiliosNoSalariales}
          tooltip="No cotizan ni entran a base prestacional (Art. 128 CST)." />
        <LineaResultado label="Total devengado" value={resultado.totalDevengado} bold />
        <div className="pt-1 text-xs text-gray-400">Base aportes: {formatCOP(resultado.baseAportes)}</div>
      </Card>

      <Card title="Deducciones empleado" accent="red">
        <LineaResultado label="Salud (4%)" value={resultado.saludEmpleado} negative
          tooltip="Art. 204 Ley 100/1993: 4% a cargo del trabajador." />
        <LineaResultado label="Pensión (4%)" value={resultado.pensionEmpleado} negative
          tooltip="Art. 7 Ley 797/2003: 4% a cargo del trabajador." />
        <LineaResultado label="FSP (solidaridad)" value={resultado.fsp} negative
          tooltip="Fondo de Solidaridad Pensional. Aplica desde 4 SMMLV con tasa escalonada (Art. 27 Ley 100/93 + Ley 797/2003)." />
        <LineaResultado label="Retención en la fuente" value={resultado.retencionFuente} negative
          tooltip="Art. 383 ET: tabla progresiva sobre base gravable mensual depurada." />
        <LineaResultado label="Total deducciones" value={resultado.totalDeducciones + resultado.retencionFuente} bold negative />
      </Card>

      <Card title="Neto empleado" accent="green">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums mb-3">
          {formatCOP(resultado.netoEmpleado)}
        </div>

        {/* Distribución por quincenas */}
        {(() => {
          const saludQ  = resultado.saludEmpleado / 2;
          const pensionQ = resultado.pensionEmpleado / 2;
          const brutoQ   = resultado.totalDevengado / 2;

          const netoQ1 = brutoQ - saludQ - pensionQ;
          const netoQ2 = brutoQ - saludQ - pensionQ - resultado.fsp - resultado.retencionFuente;

          const pctQ1 = resultado.netoEmpleado > 0 ? (netoQ1 / resultado.netoEmpleado) * 100 : 50;
          const pctQ2 = 100 - pctQ1;

          return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Distribución por quincenas
              </div>

              {/* Barra visual */}
              <div className="flex h-6 mx-3 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-400 dark:bg-green-500 flex items-center justify-center text-white text-xs font-medium transition-all"
                  style={{ width: `${Math.max(pctQ1, 5)}%` }}
                >
                  {pctQ1.toFixed(0)}%
                </div>
                <div
                  className="bg-emerald-600 dark:bg-emerald-700 flex items-center justify-center text-white text-xs font-medium transition-all"
                  style={{ width: `${Math.max(pctQ2, 5)}%` }}
                >
                  {pctQ2.toFixed(0)}%
                </div>
              </div>

              {/* Detalle quincenas */}
              <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 mt-2">
                {/* Q1 */}
                <div className="px-3 py-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500 shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">1ª Quincena</span>
                  </div>
                  <div className="text-base font-bold text-green-600 dark:text-green-400 tabular-nums">
                    {formatCOP(netoQ1)}
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div className="flex justify-between"><span>½ devengado</span><span>{formatCOP(brutoQ)}</span></div>
                    <div className="flex justify-between text-red-400"><span>− Salud (4%)</span><span>{formatCOP(saludQ)}</span></div>
                    <div className="flex justify-between text-red-400"><span>− Pensión (4%)</span><span>{formatCOP(pensionQ)}</span></div>
                  </div>
                </div>

                {/* Q2 */}
                <div className="px-3 py-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-700 shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">2ª Quincena</span>
                  </div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatCOP(netoQ2)}
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div className="flex justify-between"><span>½ devengado</span><span>{formatCOP(brutoQ)}</span></div>
                    <div className="flex justify-between text-red-400"><span>− Salud (4%)</span><span>{formatCOP(saludQ)}</span></div>
                    <div className="flex justify-between text-red-400"><span>− Pensión (4%)</span><span>{formatCOP(pensionQ)}</span></div>
                    {resultado.fsp > 0 && (
                      <div className="flex justify-between text-red-400"><span>− FSP</span><span>{formatCOP(resultado.fsp)}</span></div>
                    )}
                    {resultado.retencionFuente > 0 && (
                      <div className="flex justify-between text-red-400"><span>− RteFte</span><span>{formatCOP(resultado.retencionFuente)}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="text-xs text-gray-400 mt-2">
          RteFte — Base depurada: {formatCOP(resultado.rtefte.baseDepurada)}
          {resultado.rtefte.dependientes > 0 && ` · Dependientes: −${formatCOP(resultado.rtefte.dependientes)}`}
          {resultado.rtefte.rentaExenta > 0 && ` · Renta exenta 25%: −${formatCOP(resultado.rtefte.rentaExenta)}`}
        </div>
      </Card>

      <Card title="Aportes empleador" accent="orange">
        <LineaResultado label="Salud (8.5%)" value={resultado.saludEmpleador}
          tooltip="Art. 204 Ley 100/93. Exonerado por Ley 1819/2016 si aplica." />
        <LineaResultado label="Pensión (12%)" value={resultado.pensionEmpleador}
          tooltip="Art. 7 Ley 797/2003: 12% a cargo del empleador." />
        <LineaResultado label="ARL" value={resultado.arl}
          tooltip="Riesgos laborales según nivel de riesgo I–V (Decreto 1607/2002)." />
        <LineaResultado label="SENA (2%)" value={resultado.sena}
          tooltip="Ley 21/1982. Exonerado por Ley 1819/2016 si aplica." />
        <LineaResultado label="ICBF (3%)" value={resultado.icbf}
          tooltip="Ley 89/1988. Exonerado por Ley 1819/2016 si aplica." />
        <LineaResultado label="Caja Compensación (4%)" value={resultado.caja}
          tooltip="Ley 21/1982: 4% a cargo del empleador." />
        <LineaResultado label="Total carga empleador" value={resultado.totalCargaEmpleador} bold />
      </Card>

      <Card title="Prestaciones sociales causadas" accent="purple">
        <LineaResultado label="Cesantías (mensual)" value={resultado.cesantiasMes}
          tooltip="1/12 del salario + auxilio transporte. Art. 249 CST." />
        <LineaResultado label="Intereses cesantías" value={resultado.interesesCesantiasMes}
          tooltip="12% anual sobre cesantías acumuladas. Art. 1 Ley 52/1975." />
        <LineaResultado label="Prima de servicios (mensual)" value={resultado.primaMes}
          tooltip="1/12 del salario + auxilio transporte. Art. 306 CST." />
        <LineaResultado label="Vacaciones (causado mensual)" value={resultado.vacacionesMes}
          tooltip="15 días hábiles por año sobre salario básico. Art. 186 CST." />
        <LineaResultado label="Total prestaciones" value={resultado.totalPrestaciones} bold />
      </Card>

      <Card title="Costo total empresa" accent="blue">
        <LineaResultado label="Nómina + carga empleador + prestaciones" value={resultado.costoTotalEmpresa} bold />
      </Card>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => exportarPDF(resultado, inputs.salarioBasico)}
          className="flex-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 transition-colors"
        >
          Exportar PDF
        </button>
        <button
          onClick={exportJSON}
          className="flex-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 transition-colors"
        >
          Exportar JSON
        </button>
        {onGuardar && (
          <button
            onClick={onGuardar}
            className="flex-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 transition-colors"
          >
            Guardar en histórico
          </button>
        )}
      </div>
    </div>
  );
}
