import { formatCOP } from '../../utils/format';
import type { PuntoDashboard } from '../../types';

interface Props { puntos: PuntoDashboard[] }

export function TablaMeses({ puntos }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <th className="px-3 py-2 text-left">Mes</th>
            <th className="px-3 py-2 text-right">Ingreso total</th>
            <th className="px-3 py-2 text-right">Gastos</th>
            <th className="px-3 py-2 text-right">Ahorro mes</th>
            <th className="px-3 py-2 text-right">Ahorro acum.</th>
          </tr>
        </thead>
        <tbody>
          {puntos.map((p, i) => (
            <tr
              key={i}
              className={`border-t border-gray-100 dark:border-gray-700 ${
                p.primaEfectiva > 0
                  ? 'bg-purple-50/40 dark:bg-purple-900/10'
                  : p.intCesantias > 0
                  ? 'bg-amber-50/40 dark:bg-amber-900/10'
                  : ''
              }`}
            >
              <td className="px-3 py-1.5 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                {p.mes} {p.anio}
                {p.primaEfectiva > 0 && <span className="ml-1 text-purple-500 text-xs">+prima</span>}
                {p.intCesantias > 0 && <span className="ml-1 text-amber-500 text-xs">+int.ces.</span>}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums text-blue-600 dark:text-blue-400">
                {formatCOP(p.ingresoTotal)}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums text-red-500">
                {formatCOP(p.gastos)}
              </td>
              <td className={`px-3 py-1.5 text-right tabular-nums font-semibold ${
                p.superavit ? 'text-green-600 dark:text-green-400' : 'text-red-500'
              }`}>
                {p.superavit ? '+' : ''}{formatCOP(p.ahorro)}
              </td>
              <td className={`px-3 py-1.5 text-right tabular-nums font-bold ${
                p.ahorroAcumulado >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-600'
              }`}>
                {formatCOP(p.ahorroAcumulado)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
