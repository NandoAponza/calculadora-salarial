export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function fmtMoneda(v: number, moneda: 'USD' | 'EUR' | 'GBP'): string {
  return new Intl.NumberFormat(moneda === 'USD' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(Math.round(v));
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
