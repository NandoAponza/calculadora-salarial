import { describe, it, expect } from 'vitest';
import { calcularFSP, calcularAuxilioTransporte, calcularNomina } from './nomina';
import { SMMLV, AUXILIO_TRANSPORTE, UVT } from '../config/constants';

describe('calcularFSP', () => {
  it('no aplica para salarios < 4 SMMLV', () => {
    expect(calcularFSP(SMMLV * 3)).toBe(0);
  });
  it('aplica 1% para salarios entre 4 y 16 SMMLV', () => {
    const base = SMMLV * 5;
    expect(calcularFSP(base)).toBeCloseTo(base * 0.01, 0);
  });
});

describe('calcularAuxilioTransporte', () => {
  it('aplica si devengado <= 2 SMMLV', () => {
    expect(calcularAuxilioTransporte(SMMLV, false)).toBe(AUXILIO_TRANSPORTE);
  });
  it('no aplica si devengado > 2 SMMLV', () => {
    expect(calcularAuxilioTransporte(SMMLV * 3, false)).toBe(0);
  });
  it('no aplica en salario integral', () => {
    expect(calcularAuxilioTransporte(SMMLV, true)).toBe(0);
  });
});

describe('calcularNomina - salario mínimo', () => {
  const inputs = {
    salarioBasico: SMMLV,
    bonosComisiones: 0,
    horasExtrasOrdinarias: 0,
    horasExtrasNocturnas: 0,
    horasExtrasDominicales: 0,
    auxiliosNoSalariales: 0,
    esIntegral: false,
    nivelARL: 1 as const,
    exoneracionLey1819: true,
    numeroDependientes: 0,
    aportesAFC: 0,
    aportesVoluntariosPension: 0,
    medicinaPrepagada: 0,
    interesesVivienda: 0,
  };

  it('calcula salud empleado 4%', () => {
    const r = calcularNomina(inputs);
    expect(r.saludEmpleado).toBeCloseTo(SMMLV * 0.04, 0);
  });

  it('calcula pensión empleado 4%', () => {
    const r = calcularNomina(inputs);
    expect(r.pensionEmpleado).toBeCloseTo(SMMLV * 0.04, 0);
  });

  it('no causa RteFte en salario mínimo', () => {
    const r = calcularNomina(inputs);
    expect(r.retencionFuente).toBe(0);
  });

  it('incluye auxilio de transporte', () => {
    const r = calcularNomina(inputs);
    expect(r.auxilioTransporte).toBe(AUXILIO_TRANSPORTE);
  });

  it('exoneración ley 1819 elimina salud empleador', () => {
    const r = calcularNomina(inputs);
    expect(r.saludEmpleador).toBe(0);
    expect(r.sena).toBe(0);
    expect(r.icbf).toBe(0);
  });
});

describe('calcularNomina - salario alto con RteFte', () => {
  const inputs = {
    salarioBasico: 15_000_000,
    bonosComisiones: 0,
    horasExtrasOrdinarias: 0,
    horasExtrasNocturnas: 0,
    horasExtrasDominicales: 0,
    auxiliosNoSalariales: 0,
    esIntegral: false,
    nivelARL: 1 as const,
    exoneracionLey1819: true,
    numeroDependientes: 0,
    aportesAFC: 0,
    aportesVoluntariosPension: 0,
    medicinaPrepagada: 0,
    interesesVivienda: 0,
  };

  it('genera retención en la fuente positiva', () => {
    const r = calcularNomina(inputs);
    expect(r.retencionFuente).toBeGreaterThan(0);
  });

  it('el neto es menor que el bruto', () => {
    const r = calcularNomina(inputs);
    expect(r.netoEmpleado).toBeLessThan(r.totalDevengado);
  });
});
