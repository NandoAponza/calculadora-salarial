// Prima de servicios: Art. 306 CST — pagada en junio (semestre ene-jun) y diciembre (jul-dic)
// Intereses de cesantías: Art. 1 Ley 52/1975 — pagados en enero sobre el acumulado del año anterior
import { PARAMS_LEGALES_2026 } from '../config/constants';
import { calcularNomina } from './nomina';
import type { InputsNomina, ResultadoNomina, ParamsLegales } from '../types';

export interface PuntoProyeccion {
  mes: string;
  neto: number;
  primaEfectiva: number;
  intCesantiasEfectivos: number;
  netoTotal: number;
  bruto: number;
  costoEmpresa: number;
  deducciones: number;
  prestaciones: number;
}

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const MES_PRIMA_1 = 5;
const MES_PRIMA_2 = 11;
const MES_INT_CESANTIAS = 0;

export function calcularProyeccionAnual(inputs: InputsNomina, params: ParamsLegales = PARAMS_LEGALES_2026): {
  puntos: PuntoProyeccion[];
  totalNeto: number;
  totalNetoConExtras: number;
  totalBruto: number;
  totalCostoEmpresa: number;
  resumenAnual: ResultadoNomina;
} {
  const r = calcularNomina(inputs, params);

  const primaSemestral = r.primaMes * 6;
  const cesantiasAnuales = r.cesantiasMes * 12;
  const interesesCesantiasAnuales = cesantiasAnuales * 0.12;

  const puntos: PuntoProyeccion[] = MESES.map((mes, i) => {
    const primaEfectiva = (i === MES_PRIMA_1 || i === MES_PRIMA_2) ? primaSemestral : 0;
    const intCesantiasEfectivos = i === MES_INT_CESANTIAS ? interesesCesantiasAnuales : 0;

    return {
      mes,
      neto: r.netoEmpleado,
      primaEfectiva,
      intCesantiasEfectivos,
      netoTotal: r.netoEmpleado + primaEfectiva + intCesantiasEfectivos,
      bruto: r.totalDevengado,
      costoEmpresa: r.costoTotalEmpresa,
      deducciones: r.totalDeducciones + r.retencionFuente,
      prestaciones: r.totalPrestaciones,
    };
  });

  const totalNeto = puntos.reduce((a, p) => a + p.neto, 0);
  const totalNetoConExtras = puntos.reduce((a, p) => a + p.netoTotal, 0);
  const totalBruto = puntos.reduce((a, p) => a + p.bruto, 0);
  const totalCostoEmpresa = puntos.reduce((a, p) => a + p.costoEmpresa, 0);

  return { puntos, totalNeto, totalNetoConExtras, totalBruto, totalCostoEmpresa, resumenAnual: r };
}
