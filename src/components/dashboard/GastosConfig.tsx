import { useState } from 'react';
import { formatCOP } from '../../utils/format';
import type { CategoriaGasto } from '../../types';

const CATEGORIAS_DEFAULT: Omit<CategoriaGasto, 'id'>[] = [
  { nombre: 'Vivienda',         monto: 800_000,  emoji: '🏠', color: '#3b82f6' },
  { nombre: 'Alimentación',     monto: 600_000,  emoji: '🛒', color: '#22c55e' },
  { nombre: 'Transporte',       monto: 250_000,  emoji: '🚌', color: '#f97316' },
  { nombre: 'Servicios públicos', monto: 200_000, emoji: '💡', color: '#f59e0b' },
  { nombre: 'Salud / Medicina', monto: 150_000,  emoji: '🏥', color: '#ec4899' },
  { nombre: 'Entretenimiento',  monto: 200_000,  emoji: '🎬', color: '#a855f7' },
  { nombre: 'Educación',        monto: 0,        emoji: '📚', color: '#14b8a6' },
  { nombre: 'Ahorro / Inversión', monto: 0,      emoji: '💰', color: '#6366f1' },
];

const PALETA = ['#3b82f6','#22c55e','#f97316','#f59e0b','#ec4899','#a855f7','#14b8a6','#6366f1','#84cc16','#06b6d4','#ef4444','#8b5cf6'];

export function crearCategoriasDefault(): CategoriaGasto[] {
  return CATEGORIAS_DEFAULT.map((c, i) => ({ ...c, id: `cat-${i}` }));
}

interface Props {
  categorias: CategoriaGasto[];
  onChange: (cats: CategoriaGasto[]) => void;
  otrosIngresos: number;
  onOtrosIngresos: (v: number) => void;
}

export function GastosConfig({ categorias, onChange, otrosIngresos, onOtrosIngresos }: Props) {
  const [nuevaNombre, setNuevaNombre] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');

  const total = categorias.reduce((s, c) => s + c.monto, 0);

  const actualizar = (id: string, monto: number) =>
    onChange(categorias.map(c => c.id === id ? { ...c, monto } : c));

  const eliminar = (id: string) => onChange(categorias.filter(c => c.id !== id));

  const agregar = () => {
    if (!nuevaNombre.trim()) return;
    const monto = Math.max(0, parseFloat(nuevoMonto) || 0);
    const idx = categorias.length % PALETA.length;
    onChange([...categorias, {
      id: `cat-${Date.now()}`,
      nombre: nuevaNombre.trim(),
      monto,
      emoji: '📌',
      color: PALETA[idx],
    }]);
    setNuevaNombre('');
    setNuevoMonto('');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Otros ingresos */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-3">
        <label className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
          Otros ingresos mensuales (arriendo, freelance…)
        </label>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm text-gray-500">$</span>
          <input
            type="number"
            min={0}
            step={10000}
            value={otrosIngresos}
            onChange={e => onOtrosIngresos(Math.max(0, parseFloat(e.target.value) || 0))}
            className="flex-1 rounded-md border border-blue-200 dark:border-blue-600 bg-white dark:bg-gray-800 text-sm px-3 py-1.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de gastos */}
      <div className="flex flex-col gap-2">
        {categorias.map(cat => (
          <div key={cat.id} className="flex items-center gap-2 group">
            <span className="text-base w-6 text-center shrink-0">{cat.emoji}</span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: cat.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{cat.nombre}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 hidden sm:block">$</span>
              <input
                type="number"
                min={0}
                step={10000}
                value={cat.monto}
                onChange={e => actualizar(cat.id, Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-2 py-1 text-right text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none tabular-nums"
              />
            </div>
            <button
              onClick={() => eliminar(cat.id)}
              className="text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Total gastos */}
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total gastos/mes</span>
        <span className="text-base font-bold text-red-500 tabular-nums">{formatCOP(total)}</span>
      </div>

      {/* Agregar categoría */}
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-3">
        <p className="text-xs text-gray-400 mb-2 font-medium">Agregar categoría</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevaNombre}
            onChange={e => setNuevaNombre(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-2 py-1.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="$ Valor"
            value={nuevoMonto}
            onChange={e => setNuevoMonto(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
            className="w-28 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-2 py-1.5 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={agregar}
            className="rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 transition-colors font-medium"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
