// Parámetros legales que cambian anualmente y afectan todos los cálculos
export interface ParamsLegales {
  smmlv: number;
  auxilioTransporte: number;
  uvt: number;
}

export type TipoContrato = 'indefinido' | 'fijo' | 'obra';
export type MotivoTerminacion = 'renuncia' | 'despido_justa_causa' | 'despido_sin_justa_causa';
export type NivelARL = 1 | 2 | 3 | 4 | 5;

export interface InputsNomina {
  salarioBasico: number;
  bonosComisiones: number;
  horasExtrasOrdinarias: number;
  horasExtrasNocturnas: number;
  horasExtrasDominicales: number;
  auxiliosNoSalariales: number;
  esIntegral: boolean;
  nivelARL: NivelARL;
  exoneracionLey1819: boolean;
  // Depuración RteFte
  numeroDependientes: number;
  aportesAFC: number;
  aportesVoluntariosPension: number;
  medicinaPrepagada: number;
  interesesVivienda: number;
}

export interface InputsLiquidacion extends InputsNomina {
  fechaIngreso: string;
  fechaLiquidacion: string;
  tipoContrato: TipoContrato;
  mesesContratoFijo: number;
  motivoTerminacion: MotivoTerminacion;
}

export interface ResultadoNomina {
  // Ingresos
  salarioBasico: number;
  otrosIngresos: number;
  auxilioTransporte: number;
  totalDevengado: number;
  baseAportes: number;

  // Deducciones empleado
  saludEmpleado: number;
  pensionEmpleado: number;
  fsp: number;
  totalDeducciones: number;

  // Neto
  retencionFuente: number;
  netoEmpleado: number;

  // Aportes empleador
  saludEmpleador: number;
  pensionEmpleador: number;
  arl: number;
  sena: number;
  icbf: number;
  caja: number;
  totalCargaEmpleador: number;
  costoTotalEmpresa: number;

  // Prestaciones causadas (mensual)
  cesantiasMes: number;
  interesesCesantiasMes: number;
  primaMes: number;
  vacacionesMes: number;
  totalPrestaciones: number;

  // RteFte detalle
  rtefte: ReteFuenteDetalle;
}

export interface ReteFuenteDetalle {
  baseGravable: number;
  dependientes: number;
  afc: number;
  voluntariaPension: number;
  medicinaPrepagada: number;
  interesesVivienda: number;
  rentaExenta: number;
  baseDepurada: number;
  retencion: number;
}

export interface ResultadoLiquidacion {
  diasTrabajados: number;
  cesantias: number;
  interesesCesantias: number;
  prima: number;
  vacaciones: number;
  indemnizacion: number;
  totalLiquidacion: number;
  motivoTerminacion: MotivoTerminacion;
  tipoContrato: TipoContrato;
  altoSalario: boolean;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface CategoriaGasto {
  id: string;
  nombre: string;
  monto: number;
  emoji: string;
  color: string;
}

export type PeriodoDashboard = 1 | 3 | 6 | 12 | 24;

export interface InputsDashboard {
  mesInicio: number;        // 0–11
  anioInicio: number;
  mesesProyeccion: number;  // 1–60
  categorias: CategoriaGasto[];
  otrosIngresos: number;    // ingresos extra fuera de nómina (freelance, arriendo, etc.)
}

export interface PuntoDashboard {
  mes: string;
  mesIndex: number;
  anio: number;
  ingresoNomina: number;
  primaEfectiva: number;
  intCesantias: number;
  otrosIngresos: number;
  ingresoTotal: number;
  gastos: number;
  ahorro: number;
  ahorroAcumulado: number;
  superavit: boolean;
}

export interface ResultadoDashboard {
  puntos: PuntoDashboard[];
  totalIngreso: number;
  totalGastos: number;
  totalAhorro: number;
  tasaAhorro: number;
  ahorroAcumuladoFinal: number;
  promedioMensualAhorro: number;
  mesesColchon: number;
}

// ── Dólares ───────────────────────────────────────────────────────────────────

export type TipoTrabajadorUSD = 'independiente' | 'empleado';
export type TipoServicio = 'honorarios' | 'servicios';
export type Moneda = 'USD' | 'EUR' | 'GBP';

export interface InputsDolares {
  moneda: Moneda;
  trm: number;
  tipoTrabajador: TipoTrabajadorUSD;

  // Independiente
  ingresoUSD: number;
  tipoServicio: TipoServicio;
  esDeclarante: boolean;
  gastosDeducibles: number;         // COP, gastos reales Art. 107 ET
  afiliadoARL: boolean;
  nivelARLIndep: NivelARL;

  // Contrato laboral (reutiliza InputsNomina pero en USD)
  salarioUSD: number;
  otrosIngresosUSD: number;
  esIntegral: boolean;
  nivelARL: NivelARL;
  exoneracionLey1819: boolean;
  numeroDependientes: number;
  aportesAFC: number;
  aportesVoluntariosPension: number;
  medicinaPrepagada: number;
  interesesVivienda: number;
}

export interface ResultadoIndependienteUSD {
  moneda: Moneda;
  trm: number;
  ingresoBrutoCOP: number;
  ingresoBrutoUSD: number;
  ibc: number;
  ibcEnSMMLV: number;
  saludCOP: number;
  pensionCOP: number;
  fspCOP: number;
  retencionFuenteCOP: number;
  totalDescuentosCOP: number;
  netoCOP: number;
  netoUSD: number;
  // ARL voluntaria
  arlCOP: number;
  // para mostrar detalle
  ibcMinAplicado: boolean;
  ibcMaxAplicado: boolean;
  baseRteFte: number;
}

export interface ResultadoEmpleadoUSD {
  moneda: Moneda;
  trm: number;
  salarioCOP: number;
  salarioUSD: number;
  nomina: ResultadoNomina;
  netoCOP: number;
  netoUSD: number;
  costoEmpresaCOP: number;
  costoEmpresaUSD: number;
}

// ── Histórico ─────────────────────────────────────────────────────────────────

export interface EntradaHistorico {
  id: string;
  fecha: string;
  etiqueta: string;
  inputs: InputsNomina;
  resultado: ResultadoNomina;
}
