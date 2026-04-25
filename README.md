# Calculadora Salarial Colombia 2026

Aplicación web local para calcular nómina, liquidación y proyección anual bajo la legislación laboral colombiana.

## Inicio rápido

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Tests

```bash
npm test
```

## Valores legales vigentes (2026)

| Concepto | Valor | Fuente |
|----------|-------|--------|
| SMMLV | $1.750.905 | Decreto 1469 del 29 dic 2025 |
| Auxilio de transporte | $249.095 | Decreto 1470 del 29 dic 2025 |
| UVT | $52.374 | Resolución DIAN 000238 del 15 dic 2025 |

**Actualizar cada enero** el archivo `src/config/constants.ts` con los decretos del nuevo año.

## Funcionalidades

- **Nómina mensual**: Aportes empleado/empleador, FSP escalonado, ARL I–V, parafiscales con exoneración Ley 1819, prestaciones causadas, retención en la fuente Art. 383 ET con depuración completa
- **Liquidación definitiva**: Cesantías, intereses, prima, vacaciones e indemnización proporcionales
- **Proyección anual**: Gráficos neto vs bruto y costo empresa con Recharts
- Modo claro/oscuro, exportación PDF y JSON
- Tooltips con fundamento legal en cada campo

## Fundamentos legales principales

- Art. 204 Ley 100/1993 — aportes en salud
- Art. 7 Ley 797/2003 — aportes en pensión
- Art. 27 Ley 100/1993 + Ley 797/2003 — FSP escalonado
- Art. 132 CST — salario integral
- Ley 1819/2016 Art. 65 — exoneración parafiscales
- Art. 383 y 387 ET — retención en la fuente
- Art. 249, 306, 186 CST + Ley 52/1975 — prestaciones sociales
- Art. 64 CST — indemnización por despido
