---
name: Salud Planetaria · Mar de Cortés
description: Diagnóstico regional de los límites planetarios para los 5 estados del Mar de Cortés.
colors:
  navy: "#0a3a66"
  navy-deep: "#072a4a"
  teal: "#176f8a"
  teal-bright: "#2fa8c8"
  logo-mauve: "#b06c93"
  logo-coral: "#e0665e"
  logo-orange: "#ec8343"
  logo-turq: "#2fa8c8"
  bg: "#f7f8f6"
  surface: "#ffffff"
  surface-2: "#eef2f3"
  ink: "#14212e"
  muted: "#4a5866"
  faint: "#6b7884"
  border: "#d9e0e4"
  status-safe: "#2e7d4f"
  status-risk: "#b7791f"
  status-high: "#b03a2e"
  priority-high: "#0a3a66"
  priority-mid: "#3f7fa6"
  priority-low: "#a9c8da"
  chart-categorical: ["#2a64a8", "#cc6c26", "#1a9aad", "#9b4f95"]
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
rounded:
  md: "10px"
  sm: "7px"
spacing:
  sm: "8px"
  md: "16px"
---

# Design System: Salud Planetaria · Mar de Cortés

## Overview

**North Star: "Identidad Corredor".** El sitio es la voz pública de una red académica (Observatorio Tecnológico del Mar de Cortés, cinco universidades públicas y el Foro Mar de Cortés). Su identidad sale directamente del logo del **Corredor Científico, Académico y Empresarial del Mar de Cortés**: el azul marino del logotipo da la estructura y la autoridad; el turquesa marca la acción; los arcos de color del isotipo (malva, coral, naranja, turquesa) aparecen como un **filete de cuatro colores**, eco discreto del logo.

El tono es académico pero abierto: tipografía serif para títulos, mucha legibilidad, fondo claro y datos siempre rotulados en texto. La portada usa la imagen satelital del golfo para dar identidad regional inmediata a cualquier audiencia.

**Key Characteristics:**
- Fondo claro neutro; estructura en azul marino (encabezado, títulos, pie).
- Turquesa oscuro para enlaces y foco; turquesa claro para botones principales sobre fondo marino.
- Los colores del isotipo solo en el filete de 4 colores, en las categorías de actores y en las gráficas categóricas.
- Los colores de estado (verde/ámbar/rojo) son semánticos y nunca se usan como decoración.

## Colors

### Institucional y acción
- **Navy** (`#0a3a66`): títulos, barra de navegación, cifras clave, prioridad alta. **Navy profundo** (`#072a4a`) para el pie y el velo de la portada.
- **Teal** (`#176f8a`): enlaces, foco del teclado, notas de gráfica. Cumple AA (≥ 4.5:1) sobre blanco.
- **Teal brillante** (`#2fa8c8`): botón principal y subrayado activo sobre fondo navy. No usarlo para texto sobre blanco.

### Acentos del logo
Malva `#b06c93`, coral `#e0665e`, naranja `#ec8343` y turquesa `#2fa8c8`. Se usan en:
- el filete `--ribbon` bajo el encabezado, al pie de la portada y sobre el pie de página;
- el borde superior de las tarjetas «¿Por dónde empezar?»;
- las etiquetas de actor (privado = malva, gobierno = navy, academia = turquesa, sociedad = naranja), siempre en versión suave con texto oscuro.

### Neutros
Fondo `#f7f8f6`, superficie `#ffffff`, superficie-2 `#eef2f3`, tinta `#14212e`, atenuado `#4a5866`, tenue `#6b7884` (mínimo para texto pequeño) y borde `#d9e0e4`.

### Estado y prioridad
- **Estado:** seguro `#2e7d4f`, riesgo creciente `#b7791f`, alto riesgo `#b03a2e`. Siempre van con etiqueta de texto.
- **Prioridad:** rampa navy (alta `#0a3a66`, media `#3f7fa6`, baja `#a9c8da`), distinta de los estados.

### Gráficas
- **Categórica**, en orden fijo: azul `#2a64a8`, naranja `#cc6c26`, turquesa `#1a9aad`, malva `#9b4f95`. Está validada con el validador de la skill *dataviz*: separación para daltonismo ΔE ≥ 8 y contraste ≥ 3:1 sobre blanco. Con más de 4 series, usar varias gráficas pequeñas.
- **Secuencial (mapas):** un solo tono, de azul claro `#d6e6f2` a navy `#0a3a66`.
- **Positivo/negativo:** turquesa `#1a9aad` y naranja `#cc6c26`. Nunca verde/rojo.
- El tema ECharts `mdc` (`src/lib/EChart.tsx`) centraliza la paleta, los ejes y la fuente. Las gráficas no deben llevar colores fijos propios.

### Named Rules
**The Status Is Sacred Rule.** El rojo, el ámbar y el verde de estado no se reutilizan para series, decoración ni prioridad. Los acentos coral y naranja del logo no se usan cerca de los indicadores de estado.

**The Logo Stays Intact Rule.** El logo del Corredor se usa sin alterar, sobre fondo blanco, en la franja institucional superior. No se recolorea ni se coloca sobre fondo de color.

## Typography

- **Display:** Source Serif 4 (600/700), para h1–h3, cifras clave y rótulos de lámina.
- **Body:** Source Sans 3 (400/600/700) a 17px, interlineado 1.6. La lectura corrida se limita a ~75ch y va **alineada a la izquierda** (sin justificar).
- **Mono:** solo para valores de variables de control y tablas de valores.
- Se cargan desde Google Fonts con `display=swap`. Las gráficas se redibujan cuando la fuente termina de cargar.

## Layout

- Contenedor de 1160px. Rejillas de 3, 2 y 1 columnas según el ancho.
- La franja institucional (logo) se desplaza con la página; la barra navy con la navegación queda fija (`sticky`).
- Por debajo de 900px la navegación se pliega en un botón «Menú».
- Las páginas de límite tienen un **índice lateral** fijo en escritorio, que en móvil se convierte en una fila de chips desplazable. Como el sitio usa `HashRouter`, el índice desplaza con `scrollIntoView` en lugar de anclas `#id`.
- El orden de una página de límite va del diagnóstico a los datos, luego a las fuentes y termina en la acción.

## Components

- **Hero de portada:** imagen satelital (`public/img/hero-mar-cortes.jpg`) bajo un velo navy degradado, con eyebrow, título, lead, chips de estados y dos botones.
- **Tarjeta de entrada:** borde superior de color del logo, quién (rótulo), título, texto y enlace de acción.
- **Tarjeta de métrica:** borde superior navy y cifra grande en serif.
- **Badge:** píldora con punto para estado; prioridad alta en navy sólido; `info` en turquesa suave para valores neutrales (impacto, apalancamiento, «con datos regionales»).
- **Franja institucional del pie:** logos a color de las universidades y del Foro, con su nombre corto debajo.

## Do's and Don'ts

### Do
- Rotular cada dato con valor, unidad y estado en texto.
- Usar los tokens CSS (`--navy`, `--teal`…) y el tema `mdc` de ECharts.
- Mantener contraste AA en todo texto.

### Don't
- No justificar texto.
- No usar verde/rojo para codificar magnitudes o signos en mapas y gráficas.
- No usar bordes de color gruesos salvo los bordes superiores de tarjeta definidos aquí.
- No alterar, recortar ni recolorear el logo del Corredor.
