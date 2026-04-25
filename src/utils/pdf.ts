import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCOP } from './format';
import type { ResultadoNomina } from '../types';

export function exportarPDF(resultado: ResultadoNomina, salario: number) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Calculadora Salarial Colombia 2026', 14, 18);
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 14, 26);

  autoTable(doc, {
    startY: 32,
    head: [['Concepto', 'Valor']],
    body: [
      ['Salario básico', formatCOP(resultado.salarioBasico)],
      ['Otros ingresos', formatCOP(resultado.otrosIngresos)],
      ['Auxilio transporte', formatCOP(resultado.auxilioTransporte)],
      ['Total devengado', formatCOP(resultado.totalDevengado)],
      ['', ''],
      ['Salud empleado (4%)', formatCOP(resultado.saludEmpleado)],
      ['Pensión empleado (4%)', formatCOP(resultado.pensionEmpleado)],
      ['FSP', formatCOP(resultado.fsp)],
      ['Retención en la fuente', formatCOP(resultado.retencionFuente)],
      ['Total deducciones', formatCOP(resultado.totalDeducciones + resultado.retencionFuente)],
      ['', ''],
      ['NETO A PAGAR', formatCOP(resultado.netoEmpleado)],
      ['', ''],
      ['Salud empleador', formatCOP(resultado.saludEmpleador)],
      ['Pensión empleador', formatCOP(resultado.pensionEmpleador)],
      ['ARL', formatCOP(resultado.arl)],
      ['SENA', formatCOP(resultado.sena)],
      ['ICBF', formatCOP(resultado.icbf)],
      ['Caja Compensación', formatCOP(resultado.caja)],
      ['Total carga empleador', formatCOP(resultado.totalCargaEmpleador)],
      ['', ''],
      ['Cesantías (causado mes)', formatCOP(resultado.cesantiasMes)],
      ['Intereses cesantías', formatCOP(resultado.interesesCesantiasMes)],
      ['Prima', formatCOP(resultado.primaMes)],
      ['Vacaciones', formatCOP(resultado.vacacionesMes)],
      ['', ''],
      ['Costo total empresa', formatCOP(resultado.costoTotalEmpresa)],
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save('nomina-colombia-2026.pdf');
}
