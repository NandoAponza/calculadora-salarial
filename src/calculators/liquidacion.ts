// Fundamento: Art. 249, 186, 306 CST; Ley 52/1975; Art. 64 CST (indemnización)
import {
  DIAS_VACACIONES_ANUAL, TASA_CESANTIAS, TASA_INTERESES_CESANTIAS, TASA_PRIMA,
  PARAMS_LEGALES_2026,
} from '../config/constants';
import type { InputsLiquidacion, ResultadoLiquidacion, ParamsLegales } from '../types';
import { calcularAuxilioTransporte, calcularBaseAportes } from './nomina';

function diasEntreFechas(inicio: string, fin: string): number {
  const a = new Date(inicio);
  const b = new Date(fin);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

// Indemnización Art. 64 CST — solo aplica en despido sin justa causa
// · Indefinido < 10 SMMLV: 30 días 1er año + 20 días/año adicional
// · Indefinido ≥ 10 SMMLV: 20 días 1er año + 15 días/año adicional
// · Fijo: salarios del tiempo que faltare para completar el contrato
// · Obra: no hay tarifa legal tasada (se pacta o litiga caso a caso)
function calcularIndemnizacion(
  tipoContrato: InputsLiquidacion['tipoContrato'],
  salario: number,
  diasTrabajados: number,
  mesesContratoFijo: number,
  smmlv: number,
): number {
  const salarioDia = salario / 30;

  if (tipoContrato === 'indefinido') {
    const anios = diasTrabajados / 365;
    const altoSalario = salario >= 10 * smmlv;
    const diasPrimerAnio  = altoSalario ? 20 : 30;
    const diasPorAnioMas  = altoSalario ? 15 : 20;

    if (anios <= 1) return salarioDia * diasPrimerAnio;

    // Años completos adicionales (fracción de año no genera días adicionales)
    const aniosAdicionales = Math.floor(anios - 1);
    return salarioDia * (diasPrimerAnio + diasPorAnioMas * aniosAdicionales);
  }

  if (tipoContrato === 'fijo') {
    // Art. 64 §2: valor de los salarios correspondientes al tiempo que faltare
    const diasRestantes = Math.max(0, mesesContratoFijo * 30 - diasTrabajados);
    return salarioDia * diasRestantes;
  }

  // Obra o labor: no hay indemnización tasada por ley
  return 0;
}

export function calcularLiquidacion(inputs: InputsLiquidacion, params: ParamsLegales = PARAMS_LEGALES_2026): ResultadoLiquidacion {
  const diasTrabajados = diasEntreFechas(inputs.fechaIngreso, inputs.fechaLiquidacion);
  const salario = inputs.salarioBasico;

  const devengadoSalarial = salario + inputs.bonosComisiones + inputs.horasExtrasOrdinarias
    + inputs.horasExtrasNocturnas + inputs.horasExtrasDominicales;
  const auxilioTransporte = calcularAuxilioTransporte(devengadoSalarial, inputs.esIntegral, params);
  const baseAportes = calcularBaseAportes(devengadoSalarial, inputs.esIntegral, params.smmlv);

  // Base prestacional: integral usa factor 30%; ordinario usa sueldo + auxilio (Art. 132 CST)
  const basePrestacional = inputs.esIntegral
    ? baseAportes * 0.30 / 0.70
    : devengadoSalarial + auxilioTransporte;

  // Cesantías: 1 mes de salario por año trabajado, proporcional (Art. 249 CST)
  const cesantias = inputs.esIntegral ? 0 : basePrestacional * TASA_CESANTIAS * (diasTrabajados / 30);

  // Intereses cesantías: 12% ANUAL proporcional al período (Art. 1 Ley 52/1975)
  // Fórmula: cesantías × 12% × (días del período / 360)
  // Para contratos >1 año el empleador deposita cesantías cada 14 feb; este cálculo
  // es una estimación sobre el total acumulado — ajustar si hubo depósitos parciales.
  const interesesCesantias = inputs.esIntegral
    ? 0
    : cesantias * TASA_INTERESES_CESANTIAS * (diasTrabajados / 360);

  // Prima de servicios proporcional (Art. 306 CST)
  const prima = inputs.esIntegral ? 0 : basePrestacional * TASA_PRIMA * (diasTrabajados / 30);

  // Vacaciones: 15 días hábiles/año sobre salario básico, proporcional (Art. 186 CST)
  // El salario integral NO incluye vacaciones — deben pagarse (Art. 132 CST)
  const vacaciones = (salario / 30) * (DIAS_VACACIONES_ANUAL * diasTrabajados / 360);

  // Indemnización: ÚNICAMENTE en despido sin justa causa (Art. 64 CST)
  const altoSalario = salario >= 10 * params.smmlv;
  const indemnizacion = inputs.motivoTerminacion === 'despido_sin_justa_causa'
    ? calcularIndemnizacion(inputs.tipoContrato, salario, diasTrabajados, inputs.mesesContratoFijo, params.smmlv)
    : 0;

  const totalLiquidacion = cesantias + interesesCesantias + prima + vacaciones + indemnizacion;

  return {
    diasTrabajados,
    cesantias,
    interesesCesantias,
    prima,
    vacaciones,
    indemnizacion,
    totalLiquidacion,
    motivoTerminacion: inputs.motivoTerminacion,
    tipoContrato: inputs.tipoContrato,
    altoSalario,
  };
}
