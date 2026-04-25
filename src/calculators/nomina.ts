// Fundamento legal general: CST, Ley 100/1993, Ley 797/2003, Ley 1819/2016
import {
  SMMLV_INTEGRAL_MIN, FACTOR_PRESTACIONAL_INTEGRAL,
  TASA_SALUD_EMPLEADO, TASA_PENSION_EMPLEADO,
  TASA_SALUD_EMPLEADOR, TASA_PENSION_EMPLEADOR,
  FSP_RANGOS, ARL_TASAS,
  TASA_SENA, TASA_ICBF, TASA_CAJA,
  TOPE_EXONERACION_SMMLV,
  TASA_CESANTIAS, TASA_INTERESES_CESANTIAS, TASA_PRIMA, DIAS_VACACIONES_ANUAL,
  TOPE_DEPENDIENTES_UVT, TOPE_MEDICINA_PREPAGADA_UVT, TOPE_INTERESES_VIVIENDA_UVT,
  RENTA_EXENTA_PCT, TOPE_RENTA_EXENTA_UVT_MES,
  RETEFUENTE_TABLA,
  PARAMS_LEGALES_2026,
} from '../config/constants';
import type { InputsNomina, ResultadoNomina, ReteFuenteDetalle, ParamsLegales } from '../types';

// Fondo de Solidaridad Pensional escalonado (Art. 27 Ley 100/93 + Ley 797/2003)
export function calcularFSP(salarioBase: number, smmlv: number = PARAMS_LEGALES_2026.smmlv): number {
  const smmlvs = salarioBase / smmlv;
  const rango = FSP_RANGOS.find(r => smmlvs >= r.desde && smmlvs < r.hasta);
  if (!rango) return 0;
  return salarioBase * rango.tasa;
}

// Auxilio de transporte: aplica solo si devengado <= 2 SMMLV y no es integral (Art. 2 Ley 15/1959)
export function calcularAuxilioTransporte(
  devengado: number,
  esIntegral: boolean,
  params: Pick<ParamsLegales, 'smmlv' | 'auxilioTransporte'> = PARAMS_LEGALES_2026,
): number {
  if (esIntegral) return 0;
  return devengado <= 2 * params.smmlv ? params.auxilioTransporte : 0;
}

// Base para aportes en salario integral: 70% del total (Art. 132 CST)
export function calcularBaseAportes(
  devengadoSalarial: number,
  esIntegral: boolean,
  smmlv: number = PARAMS_LEGALES_2026.smmlv,
): number {
  if (!esIntegral) return devengadoSalarial;
  const minIntegral = SMMLV_INTEGRAL_MIN * smmlv;
  const base = Math.max(devengadoSalarial, minIntegral);
  return base * (1 - FACTOR_PRESTACIONAL_INTEGRAL);
}

// Retención en la fuente Art. 383 ET con depuración completa (Art. 387 ET)
export function calcularRetencionFuente(
  ingresoLaboral: number,
  inputs: Pick<InputsNomina, 'numeroDependientes' | 'aportesAFC' | 'aportesVoluntariosPension' | 'medicinaPrepagada' | 'interesesVivienda'>,
  saludEmpleado: number,
  pensionEmpleado: number,
  uvt: number = PARAMS_LEGALES_2026.uvt,
): ReteFuenteDetalle {
  const ingresoNeto = ingresoLaboral - saludEmpleado - pensionEmpleado;

  // Dependientes: 10% del ingreso neto, tope 32 UVT/mes (Art. 387 ET)
  const maxDependientes = inputs.numeroDependientes > 0
    ? Math.min(ingresoNeto * 0.10, TOPE_DEPENDIENTES_UVT * uvt)
    : 0;

  // AFC + aportes voluntarios pensión: tope 30% del ingreso (Art. 126-1 ET)
  const afc = Math.min(inputs.aportesAFC + inputs.aportesVoluntariosPension, ingresoLaboral * 0.30);

  // Medicina prepagada: tope 16 UVT/mes (Art. 387 ET)
  const med = Math.min(inputs.medicinaPrepagada, TOPE_MEDICINA_PREPAGADA_UVT * uvt);

  // Intereses vivienda: tope 100 UVT/mes (Art. 387 ET)
  const intViv = Math.min(inputs.interesesVivienda, TOPE_INTERESES_VIVIENDA_UVT * uvt);

  const basePrevia = ingresoNeto - maxDependientes - afc - med - intViv;

  // Renta exenta de trabajo: 25%, tope 790 UVT/año = 65,83 UVT/mes (Art. 206 numeral 10 ET)
  const rentaExenta = Math.min(basePrevia * RENTA_EXENTA_PCT, TOPE_RENTA_EXENTA_UVT_MES * uvt);

  const baseDepurada = Math.max(0, basePrevia - rentaExenta);
  const baseUVT = baseDepurada / uvt;

  // Tabla progresiva Art. 383 ET
  const rango = RETEFUENTE_TABLA.slice().reverse().find(r => baseUVT >= r.desde);
  let retencionUVT = 0;
  if (rango && rango.marginal > 0) {
    retencionUVT = rango.fijo + (baseUVT - rango.base) * rango.marginal;
  }
  const retencion = Math.max(0, retencionUVT * uvt);

  return {
    baseGravable: ingresoNeto,
    dependientes: maxDependientes,
    afc,
    voluntariaPension: inputs.aportesVoluntariosPension,
    medicinaPrepagada: med,
    interesesVivienda: intViv,
    rentaExenta,
    baseDepurada,
    retencion,
  };
}

export function calcularNomina(inputs: InputsNomina, params: ParamsLegales = PARAMS_LEGALES_2026): ResultadoNomina {
  const otrosIngresos = inputs.bonosComisiones + inputs.horasExtrasOrdinarias
    + inputs.horasExtrasNocturnas + inputs.horasExtrasDominicales;

  const devengadoSalarial = inputs.salarioBasico + otrosIngresos;
  const auxilioTransporte = calcularAuxilioTransporte(devengadoSalarial, inputs.esIntegral, params);
  const totalDevengado = devengadoSalarial + auxilioTransporte + inputs.auxiliosNoSalariales;

  const baseAportes = calcularBaseAportes(devengadoSalarial, inputs.esIntegral, params.smmlv);

  const saludEmpleado = baseAportes * TASA_SALUD_EMPLEADO;
  const pensionEmpleado = baseAportes * TASA_PENSION_EMPLEADO;
  const fsp = calcularFSP(baseAportes, params.smmlv);
  const totalDeducciones = saludEmpleado + pensionEmpleado + fsp;

  const rtefte = calcularRetencionFuente(devengadoSalarial, inputs, saludEmpleado, pensionEmpleado, params.uvt);
  const retencionFuente = rtefte.retencion;

  // Ley 1819/2016 Art. 65: exoneración salud empleador + SENA + ICBF
  const exonera = inputs.exoneracionLey1819 && (baseAportes < TOPE_EXONERACION_SMMLV * params.smmlv);

  const saludEmpleador = exonera ? 0 : baseAportes * TASA_SALUD_EMPLEADOR;
  const pensionEmpleador = baseAportes * TASA_PENSION_EMPLEADOR;
  const arl = baseAportes * ARL_TASAS[inputs.nivelARL];
  const sena = exonera ? 0 : baseAportes * TASA_SENA;
  const icbf = exonera ? 0 : baseAportes * TASA_ICBF;
  const caja = baseAportes * TASA_CAJA;
  const totalCargaEmpleador = saludEmpleador + pensionEmpleador + arl + sena + icbf + caja;

  const basePrestacional = inputs.esIntegral
    ? baseAportes * FACTOR_PRESTACIONAL_INTEGRAL / (1 - FACTOR_PRESTACIONAL_INTEGRAL)
    : devengadoSalarial + auxilioTransporte;

  const cesantiasMes = inputs.esIntegral ? 0 : basePrestacional * TASA_CESANTIAS;
  const interesesCesantiasMes = inputs.esIntegral ? 0 : cesantiasMes * TASA_INTERESES_CESANTIAS;
  const primaMes = inputs.esIntegral ? 0 : basePrestacional * TASA_PRIMA;
  const vacacionesMes = inputs.esIntegral ? 0 : (inputs.salarioBasico / 12) * (DIAS_VACACIONES_ANUAL / 30);
  const totalPrestaciones = cesantiasMes + interesesCesantiasMes + primaMes + vacacionesMes;

  const costoTotalEmpresa = totalDevengado + totalCargaEmpleador + totalPrestaciones;

  return {
    salarioBasico: inputs.salarioBasico,
    otrosIngresos,
    auxilioTransporte,
    totalDevengado,
    baseAportes,
    saludEmpleado,
    pensionEmpleado,
    fsp,
    totalDeducciones,
    retencionFuente,
    netoEmpleado: Math.max(0, totalDevengado - totalDeducciones - retencionFuente),
    saludEmpleador,
    pensionEmpleador,
    arl,
    sena,
    icbf,
    caja,
    totalCargaEmpleador,
    costoTotalEmpresa,
    cesantiasMes,
    interesesCesantiasMes,
    primaMes,
    vacacionesMes,
    totalPrestaciones,
    rtefte,
  };
}
