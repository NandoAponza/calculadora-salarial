// Fundamento legal:
// · Decreto 1601/2022: IBC independientes = 40% ingreso bruto
// · Art. 204 Ley 100/93: salud independientes 12.5% del IBC
// · Art. 7 Ley 797/2003 + Decreto 1601/2022: pensión 16% del IBC
// · Art. 392 ET: retención honorarios y servicios
// · Art. 27 Ley 100/93 + Ley 797/2003: FSP escalonado
import {
  UVT,
  IBC_PCT_INDEPENDIENTE, IBC_MAX_SMMLV,
  TASA_SALUD_INDEPENDIENTE, TASA_PENSION_INDEPENDIENTE,
  RTEFTE_HONORARIOS_DECLARANTE, RTEFTE_HONORARIOS_NO_DECLARANTE, RTEFTE_HONORARIOS_MIN_UVT,
  RTEFTE_SERVICIOS_DECLARANTE, RTEFTE_SERVICIOS_NO_DECLARANTE, RTEFTE_SERVICIOS_MIN_UVT,
  ARL_TASAS,
  PARAMS_LEGALES_2026,
} from '../config/constants';
import { calcularFSP } from './nomina';
import { calcularNomina } from './nomina';
import type { InputsDolares, ResultadoIndependienteUSD, ResultadoEmpleadoUSD, ParamsLegales } from '../types';

// IBC independiente: 40% del ingreso bruto, acotado a [1 SMMLV, 25 SMMLV]
function calcularIBC(ingresoBrutoCOP: number, smmlv: number): { ibc: number; minAplicado: boolean; maxAplicado: boolean } {
  const raw = ingresoBrutoCOP * IBC_PCT_INDEPENDIENTE;
  const minIBC = smmlv;
  const maxIBC = IBC_MAX_SMMLV * smmlv;
  const ibc = Math.min(Math.max(raw, minIBC), maxIBC);
  return { ibc, minAplicado: raw < minIBC, maxAplicado: raw > maxIBC };
}

// RteFte Art. 392 ET para honorarios y servicios
function calcularRteFteIndependiente(
  ingresoBrutoCOP: number,
  tipoServicio: InputsDolares['tipoServicio'],
  esDeclarante: boolean,
  gastosDeducibles: number,
  uvt: number,
): { retencion: number; base: number } {
  const minUVT = tipoServicio === 'honorarios' ? RTEFTE_HONORARIOS_MIN_UVT : RTEFTE_SERVICIOS_MIN_UVT;
  const baseMinima = minUVT * uvt;
  const base = Math.max(0, ingresoBrutoCOP - gastosDeducibles);

  if (ingresoBrutoCOP < baseMinima) return { retencion: 0, base };

  let tasa: number;
  if (tipoServicio === 'honorarios') {
    tasa = esDeclarante ? RTEFTE_HONORARIOS_DECLARANTE : RTEFTE_HONORARIOS_NO_DECLARANTE;
  } else {
    tasa = esDeclarante ? RTEFTE_SERVICIOS_DECLARANTE : RTEFTE_SERVICIOS_NO_DECLARANTE;
  }
  return { retencion: base * tasa, base };
}

export function calcularIndependienteUSD(inputs: InputsDolares, params: ParamsLegales = PARAMS_LEGALES_2026): ResultadoIndependienteUSD {
  const ingresoBrutoCOP = inputs.ingresoUSD * inputs.trm;
  const { ibc, minAplicado, maxAplicado } = calcularIBC(ingresoBrutoCOP, params.smmlv);

  const saludCOP = ibc * TASA_SALUD_INDEPENDIENTE;
  const pensionCOP = ibc * TASA_PENSION_INDEPENDIENTE;
  const fspCOP = calcularFSP(ibc, params.smmlv);

  const arlCOP = inputs.afiliadoARL ? ibc * ARL_TASAS[inputs.nivelARLIndep] : 0;

  const { retencion: retencionFuenteCOP, base: baseRteFte } = calcularRteFteIndependiente(
    ingresoBrutoCOP,
    inputs.tipoServicio,
    inputs.esDeclarante,
    inputs.gastosDeducibles,
    params.uvt,
  );

  const totalDescuentosCOP = saludCOP + pensionCOP + fspCOP + arlCOP + retencionFuenteCOP;
  const netoCOP = ingresoBrutoCOP - totalDescuentosCOP;
  const netoUSD = netoCOP / inputs.trm;

  return {
    moneda: inputs.moneda,
    trm: inputs.trm,
    ingresoBrutoCOP,
    ingresoBrutoUSD: inputs.ingresoUSD,
    ibc,
    ibcEnSMMLV: ibc / params.smmlv,
    saludCOP,
    pensionCOP,
    fspCOP,
    arlCOP,
    retencionFuenteCOP,
    totalDescuentosCOP,
    netoCOP,
    netoUSD,
    ibcMinAplicado: minAplicado,
    ibcMaxAplicado: maxAplicado,
    baseRteFte,
  };
}

export function calcularEmpleadoUSD(inputs: InputsDolares, params: ParamsLegales = PARAMS_LEGALES_2026): ResultadoEmpleadoUSD {
  const salarioCOP = inputs.salarioUSD * inputs.trm;
  const otrosIngresosCOP = inputs.otrosIngresosUSD * inputs.trm;

  const nominaInputs = {
    salarioBasico: salarioCOP,
    bonosComisiones: otrosIngresosCOP,
    horasExtrasOrdinarias: 0,
    horasExtrasNocturnas: 0,
    horasExtrasDominicales: 0,
    auxiliosNoSalariales: 0,
    esIntegral: inputs.esIntegral,
    nivelARL: inputs.nivelARL,
    exoneracionLey1819: inputs.exoneracionLey1819,
    numeroDependientes: inputs.numeroDependientes,
    aportesAFC: inputs.aportesAFC,
    aportesVoluntariosPension: inputs.aportesVoluntariosPension,
    medicinaPrepagada: inputs.medicinaPrepagada,
    interesesVivienda: inputs.interesesVivienda,
  };

  const nomina = calcularNomina(nominaInputs, params);

  return {
    moneda: inputs.moneda,
    trm: inputs.trm,
    salarioCOP,
    salarioUSD: inputs.salarioUSD,
    nomina,
    netoCOP: nomina.netoEmpleado,
    netoUSD: nomina.netoEmpleado / inputs.trm,
    costoEmpresaCOP: nomina.costoTotalEmpresa,
    costoEmpresaUSD: nomina.costoTotalEmpresa / inputs.trm,
  };
}
