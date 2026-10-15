---
name: Salud Planetaria · Mar de Cortés
description: Diagnóstico regional de los límites planetarios para los 5 estados del Mar de Cortés.
colors:
  verdigris: "#3f6f5f"
  verdigris-deep: "#2f5749"
  copper: "#a05a3c"
  paper: "#fbf7ee"
  paper-deep: "#f2ecdf"
  bone: "#efe7d8"
  ink: "#1f2420"
  ink-muted: "#5c564a"
  hairline: "#ddd3c1"
  status-safe: "#2e7d4f"
  status-risk: "#b8721a"
  status-high: "#b54333"
typography:
  display:
    fontFamily: "Georgia, Iowan Old Style, Palatino Linotype, Book Antiqua, Palatino, serif"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontWeight: 400
    lineHeight: 1.55
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
rounded:
  md: "10px"
  sm: "7px"
spacing:
  sm: "8px"
  md: "16px"
---

# Design System: Salud Planetaria · Mar de Cortés

## Overview

**Creative North Star: "El Gabinete del Mar de Cortés"**

El sitio se presenta como una lámina de historia natural: la piel de las expediciones que estudiaron el Golfo — sus perlas, sus especímenes rotulados, su papel envejecido. La priorización no es un gráfico más; es la columna que recorre todo el sistema. Cada dato es un espécimen rotulado con exactitud, cada estado una perla dibujada. El logo del Corredor es el sello de la lámina, integrado sobre el papel, nunca pegado sobre un banner.

La densidad es la de un gabinete: aireada pero exacta, con rótulos que dicen el valor, la unidad y el estado en texto — no solo en color. El carácter es sobrio y confiable; la identidad del Golfo vive en la paleta (verdigris marino + cobre desértico sobre papel-hueso) y en la serif grabada, no en ornamentos.

**Key Characteristics:**
- Papel-hueso como fondo; el color vive en acentos (verdigris, cobre) y en el estado (verde/ámbar/rojo).
- Serif grabada para títulos y rótulos; sans de trabajo para el cuerpo; mono para cifras y datos.
- Reglas finas y marcos de lámina en lugar de sombras duras.
- La perla como marcador de estado (círculo dibujado con brillo interior, relleno = estado).

## Colors

La paleta parte del papel-hueso y la tinta cálida; el verdigris (marino) y el cobre (desierto) son los dos acentos de la identidad del Golfo. Los tres colores de estado son semánticos y nunca se reutilizan como decoración.

### Primary
- **Verdigris** (`#3f6f5f`): el acento de acción — enlaces, navegación activa, barras de datos y el foco del teclado. El "verde-cobre" marino que ancla la identidad del Golfo.
- **Verdigris profundo** (`#2f5749`): variante oscura para prioridad alta y estados de énfasis fuerte.

### Secondary
- **Cobre** (`#a05a3c`): el acento desértico — la regla del sello en el encabezado y el pie, y el extremo cálido de los degradados marino→desértico. Escaso, nunca como relleno de superficie.

### Neutral
- **Papel** (`#fbf7ee`): fondo de superficie (tarjetas, encabezado, hero).
- **Papel profundo** (`#f2ecdf`): fondo de página.
- **Hueso** (`#efe7d8`): relleno de láminas y superficies secundarias (tonal layering).
- **Tinta** (`#1f2420`): texto principal, casi-negro cálido.
- **Tinta atenuada** (`#5c564a`): texto secundario.
- **Hilo** (`#ddd3c1`): bordes y divisores, de 1px.

### Named Rules
**The Paper Ground Rule.** Ningún bloque de color a sangre completa detrás del contenido. El color aparece en acentos, marcos, perlas y barras de estado; el fondo siempre es papel.

## Typography

**Display Font:** Georgia / Iowan Old Style / Palatino (serif con carácter grabado)
**Body Font:** system-ui sans (trabajo)
**Label/Mono Font:** ui-monospace (cifras, valores y series)

**Character:** la serif habla como rótulo de espécimen — rotulada, sobria, con autoridad de gabinete; la sans hace el trabajo de leer; la mono da la exactitud del dato.

### Hierarchy
- **Display** (600, 2.1rem–2.4rem, 1.2): títulos de página y del hero.
- **Headline** (600, 1.45rem, 1.2): títulos de sección y de tarjeta (`h2`).
- **Title** (600, 1.15rem, 1.2): subtítulos anidados (`h3`) y nombres de organismos.
- **Body** (400, 1rem, 1.55): párrafos; medida 65–75ch en lectura corrida.
- **Label** (600, 0.74rem, 0.06em, mayúsculas): rótulos de lámina y pies de especímenes.

### Named Rules
**The Caption Voice Rule.** Títulos y rótulos hablan en serif; el cuerpo nunca. Si un texto es un rótulo (valor, nombre de variable, pie de lámina), usa la voz de rótulo.

## Layout

Contenedor central de 1120px con rejillas `auto-fit` para tarjetas; ritmo de espaciado sobre una base de 8px (8/16/24/40). Las páginas de detalle agrupan por significado (diagnóstico → datos → fuentes → acción) y terminan en acción. La densidad es de gabinete: grupos relacionados pegados, secciones distintas separadas con generosidad.

## Elevation & Depth

**Plano por defecto, con capas tonales.** No se usan sombras estructurales: la profundidad viene del tono (papel sobre papel profundo, hueso para láminas). La sombra actual es ambiente y mínima.

### Shadow Vocabulary
- **Ambiente** (`box-shadow: 0 1px 2px rgba(47,40,28,0.05), 0 3px 10px rgba(47,40,28,0.06)`): reposo de tarjetas y al levantar el cursor.

### Named Rules
**The Flat-By-Default Rule.** Las superficies son planas en reposo; un marco de hilo de 1px las separa. La sombra solo aparece como respuesta al hover.

## Shapes

Esquinas suaves de 10px (tarjetas, marcos, láminas) y 7px (botones, chips, navegación). Los divisores son reglas de 1px, nunca bordes de color gruesos. La perla es el único círculo recurrente: marcador de estado con brillo interior.

## Components

### Badge de estado (perla)
- **Forma:** píldora con perla de 10px a la izquierda.
- **Perla:** círculo con `box-shadow: inset 0 1px 1px rgba(255,255,255,0.5)`; relleno = estado (verde/ámbar/rojo/gris).
- **Prioridad:** rampa verdigris (alta `#2f5749`, media `#4a7a6a`, baja `#8fb3a3`) — distinta de los colores de estado.

### Tarjeta
- **Forma:** 10px de radio, borde hilo 1px, fondo papel, sombra ambiente en hover.

### Navegación
- **Por defecto:** tinta sobre papel; **activa:** pastilla verdigris con texto blanco; **hover:** hueso.

### Lámina (signature)
- Marco de hilo 1px sobre fondo hueso, rótulo de lámina en serif mayúscula encima; filas de especímenes con nombre en serif, valor en mono y estado en texto.

## Do's and Don'ts

### Do:
- **Do** mantener el fondo en papel y el color en acentos, marcos y estado.
- **Do** rotular cada dato con valor + unidad + estado en texto (el color no carga solo el mensaje).
- **Do** usar la serif para títulos y rótulos, la mono para cifras.

### Don't:
- **Don't** usar bloques de color a sangre (banners azules/gradientes) detrás del contenido.
- **Don't** pegar el logo del Corredor sobre un fondo de color: vive sobre el papel como sello.
- **Don't** reutilizar el rojo de "alto riesgo" para prioridad ni el verde de "seguro" como decoración.
- **Don't** usar bordes de color gruesos (más de 1px) en tarjetas, listas o notas.
