// Vigencia: año 2026
// SMMLV: Decretos 1469 y 1470 del 29 de diciembre de 2025
// UVT: Resolución DIAN 000238 del 15 de diciembre de 2025
// Actualizar estos valores cada enero con los decretos del nuevo año.

export const SMMLV = 1_750_905;          // Salario Mínimo Mensual Legal Vigente 2026
export const AUXILIO_TRANSPORTE = 249_095; // Auxilio de transporte 2026
export const UVT = 52_374;               // Unidad de Valor Tributario 2026

// Tope auxilio transporte: empleados que devenguen hasta 2 SMMLV
export const TOPE_AUXILIO_TRANSPORTE = 2 * SMMLV;

// Salario integral mínimo = 13 SMMLV (Art. 132 CST)
export const SMMLV_INTEGRAL_MIN = 13;

// Factor prestacional del salario integral: 30% (Art. 132 CST)
export const FACTOR_PRESTACIONAL_INTEGRAL = 0.30;

// Tasas aportes empleado (Art. 204 Ley 100/93 y Art. 7 Ley 797/2003)
export const TASA_SALUD_EMPLEADO = 0.04;
export const TASA_PENSION_EMPLEADO = 0.04;

// Tasas aportes empleador
export const TASA_SALUD_EMPLEADOR = 0.085;
export const TASA_PENSION_EMPLEADOR = 0.12;

// Fondo de Solidaridad Pensional (Art. 27 Ley 100/93, modificado Ley 797/2003)
// Aplica a salarios >= 4 SMMLV
export const FSP_RANGOS = [
  { desde: 4,  hasta: 15.99, tasa: 0.01 },
  { desde: 16, hasta: 17.99, tasa: 0.012 },
  { desde: 18, hasta: 19.99, tasa: 0.014 },
  { desde: 20, hasta: Infinity, tasa: 0.016 },
];

// Tasas ARL por nivel de riesgo (Decreto 1607/2002 y Decreto 1072/2015)
export const ARL_TASAS: Record<number, number> = {
  1: 0.00522,
  2: 0.01044,
  3: 0.02436,
  4: 0.04350,
  5: 0.06960,
};

// Parafiscales (Ley 21/1982, Ley 89/1988)
export const TASA_SENA = 0.02;
export const TASA_ICBF = 0.03;
export const TASA_CAJA = 0.04;

// Exoneración parafiscales y salud empleador: Ley 1819/2016 Art. 65
// (Aplica a empresas que liquiden su impuesto a la renta a tarifa general,
//  para empleados con salario < 10 SMMLV)
export const TOPE_EXONERACION_SMMLV = 10;

// Prestaciones sociales (CST)
export const TASA_CESANTIAS = 1 / 12;          // Art. 249 CST
export const TASA_INTERESES_CESANTIAS = 0.12;  // Art. 1 Ley 52/1975
export const TASA_PRIMA = 1 / 12;             // Art. 306 CST
export const DIAS_VACACIONES_ANUAL = 15;       // Art. 186 CST

// Retención en la fuente Art. 383 ET - tabla de rangos en UVT (año gravable 2026)
// Marginal sobre la base gravable mensual en UVT
export const RETEFUENTE_TABLA = [
  { desde: 0,    hasta: 87,   fijo: 0,    marginal: 0,    base: 0   },
  { desde: 87,   hasta: 145,  fijo: 0,    marginal: 0.19, base: 87  },
  { desde: 145,  hasta: 335,  fijo: 11.02,marginal: 0.28, base: 145 },
  { desde: 335,  hasta: 640,  fijo: 64.22,marginal: 0.33, base: 335 },
  { desde: 640,  hasta: 945,  fijo: 164.87,marginal: 0.35,base: 640 },
  { desde: 945,  hasta: 2300, fijo: 271.62,marginal: 0.37,base: 945 },
  { desde: 2300, hasta: Infinity, fijo: 772.77, marginal: 0.39, base: 2300 },
];

// Topes deducibles RteFte (Art. 387 ET)
export const TOPE_DEPENDIENTES_UVT = 32;       // 10% del ingreso, máx 32 UVT/mes
export const TOPE_MEDICINA_PREPAGADA_UVT = 16; // 16 UVT/mes
export const TOPE_INTERESES_VIVIENDA_UVT = 100;// 100 UVT/mes

// Renta de trabajo exenta: 25% del ingreso laboral neto, máx 790 UVT/año → 65.83 UVT/mes
export const RENTA_EXENTA_PCT = 0.25;
export const TOPE_RENTA_EXENTA_UVT_MES = 790 / 12;

// ── Valores por año — presets para cálculos históricos ───────────────────────
// Fuentes: Decretos MinTrabajo (SMMLV/Aux.) · Resoluciones DIAN (UVT)
// Verificar siempre en mintrabajo.gov.co y dian.gov.co antes de usar

export const PRESETS_HISTORICOS = {
  2026: { smmlv: 1_750_905, auxilioTransporte: 249_095, uvt: 52_374 },
  2025: { smmlv: 1_423_500, auxilioTransporte: 200_000, uvt: 49_799 },
  2024: { smmlv: 1_300_000, auxilioTransporte: 162_000, uvt: 47_065 },
  2023: { smmlv: 1_160_000, auxilioTransporte: 140_606, uvt: 42_412 },
  2022: { smmlv: 1_000_000, auxilioTransporte: 117_172, uvt: 38_004 },
} as const;

export const PARAMS_LEGALES_2026 = PRESETS_HISTORICOS[2026];

// ── Dólares / Independientes ──────────────────────────────────────────────────

// Tasas de cambio de referencia — campo editable en la UI; verificar en superfinanciera.gov.co
export const TRM_DEFAULT     = 3_568.88; // COP por 1 USD — Superfinanciera, 23 abr 2026
export const EUR_DEFAULT     = 3_920.00; // COP por 1 EUR — referencia aproximada abr 2026
export const GBP_DEFAULT     = 4_520.00; // COP por 1 GBP — referencia aproximada abr 2026

// IBC independientes: 40% del ingreso bruto (Decreto 1601/2022)
// Mín = 1 SMMLV; máx = 25 SMMLV
export const IBC_PCT_INDEPENDIENTE = 0.40;
export const IBC_MAX_SMMLV = 25;

// Aportes seguridad social independientes (pagan ambas partes: empleado + empleador)
// Art. 204 Ley 100/93 · Decreto 1601/2022
export const TASA_SALUD_INDEPENDIENTE = 0.125; // 12.5% del IBC
export const TASA_PENSION_INDEPENDIENTE = 0.16; // 16% del IBC

// RteFte honorarios (Art. 392 ET): cuantía mínima 27 UVT
export const RTEFTE_HONORARIOS_DECLARANTE = 0.10;
export const RTEFTE_HONORARIOS_NO_DECLARANTE = 0.11;
export const RTEFTE_HONORARIOS_MIN_UVT = 27;

// RteFte servicios (Art. 392 ET): cuantía mínima 4 UVT
export const RTEFTE_SERVICIOS_DECLARANTE = 0.04;
export const RTEFTE_SERVICIOS_NO_DECLARANTE = 0.06;
export const RTEFTE_SERVICIOS_MIN_UVT = 4;
