import { PARAMS_LEGALES_2026 } from '../config/constants';
import { calcularNomina } from './nomina';
import type { InputsNomina, InputsDashboard, PuntoDashboard, ResultadoDashboard, ParamsLegales } from '../types';

const NOMBRES_MES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export function calcularDashboard(
  inputs: InputsDashboard,
  nominaInputs: InputsNomina,
  params: ParamsLegales = PARAMS_LEGALES_2026,
): ResultadoDashboard {
  const nomina = calcularNomina(nominaInputs, params);
  const netoMensual = nomina.netoEmpleado;

  const primaSemestral = nomina.primaMes * 6;
  const intCesantiasAnuales = nomina.cesantiasMes * 12 * 0.12;

  const gastosTotales = inputs.categorias.reduce((sum, c) => sum + c.monto, 0);

  let ahorroAcumulado = 0;
  const puntos: PuntoDashboard[] = [];

  for (let i = 0; i < inputs.mesesProyeccion; i++) {
    const mesIdx = (inputs.mesInicio + i) % 12;
    const anio = inputs.anioInicio + Math.floor((inputs.mesInicio + i) / 12);

    const primaEfectiva = (mesIdx === 5 || mesIdx === 11) ? primaSemestral : 0;
    const intCesantias = mesIdx === 0 ? intCesantiasAnuales : 0;

    const ingresoTotal = netoMensual + primaEfectiva + intCesantias + inputs.otrosIngresos;
    const ahorro = ingresoTotal - gastosTotales;
    ahorroAcumulado += ahorro;

    puntos.push({
      mes: NOMBRES_MES[mesIdx],
      mesIndex: mesIdx,
      anio,
      ingresoNomina: netoMensual,
      primaEfectiva,
      intCesantias,
      otrosIngresos: inputs.otrosIngresos,
      ingresoTotal,
      gastos: gastosTotales,
      ahorro,
      ahorroAcumulado,
      superavit: ahorro >= 0,
    });
  }

  const totalIngreso = puntos.reduce((s, p) => s + p.ingresoTotal, 0);
  const totalGastos = puntos.reduce((s, p) => s + p.gastos, 0);
  const totalAhorro = puntos.reduce((s, p) => s + p.ahorro, 0);
  const tasaAhorro = totalIngreso > 0 ? (totalAhorro / totalIngreso) * 100 : 0;
  const promedioMensualAhorro = totalAhorro / inputs.mesesProyeccion;
  const mesesColchon = gastosTotales > 0 ? ahorroAcumulado / gastosTotales : 0;

  return {
    puntos,
    totalIngreso,
    totalGastos,
    totalAhorro,
    tasaAhorro,
    ahorroAcumuladoFinal: ahorroAcumulado,
    promedioMensualAhorro,
    mesesColchon,
  };
}
