# Calculadora Salarial Colombia 2026

Aplicación web local para calcular nómina, liquidación y proyección anual bajo la legislación laboral colombiana.

## App en producción

https://calculadora-salarial-co.netlify.app/

## Inicio rápido (desarrollo local)

```bash
npm install
npm run dev
```

Abre http://localhost:5200

## Instalar como app (PWA)

### Android (Chrome)
1. Abre https://calculadora-salarial-co.netlify.app/ en Chrome
2. Toca el menú ⋮ → **"Agregar a pantalla de inicio"**
3. La app aparece en tu pantalla de inicio y funciona sin internet

### iOS (Safari)
1. Abre https://calculadora-salarial-co.netlify.app/ en Safari
2. Toca el botón **Compartir** (cuadrado con flecha ↑)
3. Desplázate y toca **"Agregar a inicio"**
4. La app queda instalada en tu pantalla de inicio

### Escritorio (Chrome / Edge)
1. Abre la URL en Chrome o Edge
2. Clic en el ícono de instalación en la barra de direcciones (o usa el banner que aparece)
3. La app se instala como aplicación nativa

> **Funciona 100% offline** después de la primera carga. Todos los cálculos son locales.

## Íconos

Los íconos en `public/icons/` son placeholders generados con System.Drawing (fondo azul + símbolo $).
Para reemplazarlos con arte final: genera PNGs de 192×192, 512×512 y 512×512 (maskable) y cópialos en esa carpeta.

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
