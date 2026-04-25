import type { EntradaHistorico, InputsNomina, ResultadoNomina } from '../types';

const KEY = 'calc-salarial-historico';
const MAX = 30;

export function cargarHistorico(): EntradaHistorico[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EntradaHistorico[]) : [];
  } catch {
    return [];
  }
}

function persistir(entradas: EntradaHistorico[]): void {
  localStorage.setItem(KEY, JSON.stringify(entradas));
}

export function guardarEntrada(
  inputs: InputsNomina,
  resultado: ResultadoNomina,
  etiqueta?: string,
): EntradaHistorico[] {
  const entradas = cargarHistorico();
  const ahora = new Date();
  const nueva: EntradaHistorico = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fecha: ahora.toISOString(),
    etiqueta: etiqueta ?? ahora.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
    inputs,
    resultado,
  };
  const actualizadas = [nueva, ...entradas].slice(0, MAX);
  persistir(actualizadas);
  return actualizadas;
}

export function eliminarEntrada(id: string): EntradaHistorico[] {
  const actualizadas = cargarHistorico().filter(e => e.id !== id);
  persistir(actualizadas);
  return actualizadas;
}
