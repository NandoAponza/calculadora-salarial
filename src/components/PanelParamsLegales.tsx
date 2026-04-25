import { useState } from 'react';
import { PARAMS_LEGALES_2026, PRESETS_HISTORICOS } from '../config/constants';
import { formatCOP } from '../utils/format';
import type { ParamsLegales } from '../types';

interface Props {
  params: ParamsLegales;
  onChange: (p: ParamsLegales) => void;
}

const ANO_ACTUAL = 2026;
const ANOS = Object.keys(PRESETS_HISTORICOS).map(Number).sort((a, b) => b - a);

function num(s: string) { return Math.max(1, parseFloat(s.replace(/\D/g, '')) || 1); }

function esDefault(p: ParamsLegales) {
  return p.smmlv === PARAMS_LEGALES_2026.smmlv
    && p.auxilioTransporte === PARAMS_LEGALES_2026.auxilioTransporte
    && p.uvt === PARAMS_LEGALES_2026.uvt;
}

export function PanelParamsLegales({ params, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);
  const modificado = !esDefault(params);

  const anoCargado = ANOS.find(a => {
    const p = PRESETS_HISTORICOS[a as keyof typeof PRESETS_HISTORICOS];
    return p.smmlv === params.smmlv && p.auxilioTransporte === params.auxilioTransporte && p.uvt === params.uvt;
  });

  return (
    <div className={`border-b transition-colors ${
      modificado
        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
        : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700'
    }`}>
      {/* Barra colapsable */}
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-left"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-semibold uppercase tracking-wide ${
            modificado ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {modificado ? `⚠ Parámetros ${anoCargado ?? 'personalizados'}` : `Parámetros ${ANO_ACTUAL}`}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            SMMLV {formatCOP(params.smmlv)}
            {' · '}
            Aux. transp. {formatCOP(params.auxilioTransporte)}
            {' · '}
            UVT {formatCOP(params.uvt)}
          </span>
        </div>
        <span className={`text-xs font-medium ml-2 shrink-0 ${
          modificado ? 'text-amber-600 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400'
        }`}>
          {abierto ? '▲ Cerrar' : '▼ Editar'}
        </span>
      </button>

      {/* Panel expandido */}
      {abierto && (
        <div className="px-4 pb-4 flex flex-col gap-4">
          {/* Selector de año */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Cargar año:</span>
            {ANOS.map(a => (
              <button
                key={a}
                onClick={() => onChange({ ...PRESETS_HISTORICOS[a as keyof typeof PRESETS_HISTORICOS] })}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  anoCargado === a
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }`}
              >
                {a}{a === ANO_ACTUAL ? ' (actual)' : ''}
              </button>
            ))}
            <span className="text-xs text-gray-400 ml-1">
              · Verificar en mintrabajo.gov.co y dian.gov.co
            </span>
          </div>

          {/* Campos editables */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Campo
              label="SMMLV"
              valor={params.smmlv}
              onChange={v => onChange({ ...params, smmlv: v })}
              tooltip="Salario Mínimo Mensual Legal Vigente. Decreto de fin de año del MinTrabajo."
            />
            <Campo
              label="Auxilio de transporte"
              valor={params.auxilioTransporte}
              onChange={v => onChange({ ...params, auxilioTransporte: v })}
              tooltip="Decreto de fin de año del MinTrabajo. Aplica a empleados que devenguen hasta 2 SMMLV."
            />
            <Campo
              label="UVT"
              valor={params.uvt}
              onChange={v => onChange({ ...params, uvt: v })}
              tooltip="Unidad de Valor Tributario. Resolución DIAN de diciembre del año anterior."
            />
          </div>

          {modificado && (
            <button
              onClick={() => onChange({ ...PARAMS_LEGALES_2026 })}
              className="self-start text-xs px-3 py-1.5 rounded-md border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              Restablecer valores 2026
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Campo({ label, valor, onChange, tooltip }: {
  label: string;
  valor: number;
  onChange: (v: number) => void;
  tooltip: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-300" title={tooltip}>
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">$</span>
        <input
          type="number"
          value={valor}
          min={1}
          step={1000}
          onChange={e => onChange(num(e.target.value))}
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-2 py-1.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none tabular-nums"
        />
      </div>
      <span className="text-xs text-gray-400">{formatCOP(valor)}</span>
    </div>
  );
}
