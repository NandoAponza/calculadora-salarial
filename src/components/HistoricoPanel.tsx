import { formatCOP } from '../utils/format';
import type { EntradaHistorico, InputsNomina } from '../types';

interface Props {
  entradas: EntradaHistorico[];
  onEliminar: (id: string) => void;
  onCargar: (inputs: InputsNomina) => void;
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return null;
  const positivo = delta > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium ${
      positivo
        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
        : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
    }`}>
      {positivo ? '▲' : '▼'} {formatCOP(Math.abs(delta))}
    </span>
  );
}

function formatFecha(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function HistoricoPanel({ entradas, onEliminar, onCargar }: Props) {
  if (entradas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-base font-medium text-gray-500 dark:text-gray-400">Sin registros guardados</p>
        <p className="text-sm mt-1">Usa el botón <strong>"Guardar en histórico"</strong> en la pestaña Nómina mensual.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400">{entradas.length} registro{entradas.length !== 1 ? 's' : ''} · máximo 30 · del más reciente al más antiguo</p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="hidden sm:table-cell text-left px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Fecha</th>
              <th className="hidden sm:table-cell text-left px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Etiqueta</th>
              <th className="hidden md:table-cell text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Salario básico</th>
              <th className="text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Neto empleado</th>
              <th className="text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Δ neto</th>
              <th className="hidden md:table-cell text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">RteFte</th>
              <th className="hidden md:table-cell text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Costo empresa</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {entradas.map((entrada, i) => {
              const siguiente = entradas[i + 1];
              const deltaNeto = siguiente
                ? entrada.resultado.netoEmpleado - siguiente.resultado.netoEmpleado
                : 0;
              return (
                <tr
                  key={entrada.id}
                  className={`border-b border-gray-100 dark:border-gray-700/50 ${
                    i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/60 dark:bg-gray-700/30'
                  }`}
                >
                  <td className="hidden sm:table-cell px-4 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                    {formatFecha(entrada.fecha)}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-2 text-gray-700 dark:text-gray-200 max-w-[160px] truncate">
                    {entrada.etiqueta}
                  </td>
                  <td className="hidden md:table-cell px-4 py-2 text-right tabular-nums text-gray-700 dark:text-gray-200">
                    {formatCOP(entrada.resultado.salarioBasico)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-semibold text-green-700 dark:text-green-400">
                    {formatCOP(entrada.resultado.netoEmpleado)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {siguiente ? <DeltaBadge delta={deltaNeto} /> : <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="hidden md:table-cell px-4 py-2 text-right tabular-nums text-orange-600 dark:text-orange-400">
                    {entrada.resultado.retencionFuente > 0
                      ? formatCOP(entrada.resultado.retencionFuente)
                      : <span className="text-gray-300 dark:text-gray-600">—</span>}
                  </td>
                  <td className="hidden md:table-cell px-4 py-2 text-right tabular-nums text-blue-700 dark:text-blue-300">
                    {formatCOP(entrada.resultado.costoTotalEmpresa)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => onCargar(entrada.inputs)}
                        title="Cargar en nómina"
                        className="text-xs px-2 py-1 rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => onEliminar(entrada.id)}
                        title="Eliminar registro"
                        className="text-xs px-2 py-1 rounded border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
