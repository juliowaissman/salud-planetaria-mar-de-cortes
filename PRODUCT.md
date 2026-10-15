# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primarios:** tomadores de decisiones de la región del Mar de Cortés — gobiernos locales (municipales y estatales) e iniciativa privada (Foro Mar de Cortés y empresas) — que necesitan saber, por cada límite planetario, si la región tiene un impacto relevante y si puede incidir en él, para priorizar dónde invertir y actuar.

**Secundarios:** investigadores/academia (consultan datos regionales con referencias citables) y sociedad civil (divulgación).

## Product Purpose

Dashboard regional que regionaliza el **Planetary Health Check 2026** (los 9 límites planetarios y sus 13 variables de control) a la escala de los cinco estados del Mar de Cortés (Baja California, Baja California Sur, Sonora, Sinaloa y Nayarit), con diagnóstico regional, gráficas, mapas, referencias accesibles y una matriz de priorización impacto × apalancamiento.

Su éxito es **convertirse en el recurso regional de referencia**: si el sitio «pasa la prueba», sustituye al sitio actual del Observatorio Tecnológico del Mar de Cortés como fuente regional de consulta sobre límites planetarios.

## Positioning

Es el único recurso que regionaliza los límites planetarios a los cinco estados del Mar de Cortés y, en lugar de presentar los nueve límites por igual, los prioriza con una matriz **impacto regional × apalancamiento regional** para no concentrar recursos donde la región no tiene un impacto relevante (p. ej., la huella de carbono regional o el ozono estratosférico). Cada dato se traza a una fuente pública con URL y fecha de acceso.

## Operating Context

Producto del **Observatorio Tecnológico del Mar de Cortés** (coordinado por la Universidad de Sonora), iniciativa del **Foro Mar de Cortés** y las cinco universidades públicas de la región (UABC, UABCS, UAN, UAS, Unison). Su primera fase analiza la incidencia regional de los límites planetarios. El contenido se revisa y completa límite por límite, de forma iterativa, con el usuario.

## Capabilities and Constraints

- Cubre 9 límites, 13 variables de control y 3 «análisis a fondo» (spotlights), con estado global (PHC 2026), diagnóstico regional, gráficas, mapas y bibliografía.
- Incluye secciones por límite: **«¿Qué puede hacer la región?»** (preguntas abiertas con referencias científicas) y **«Lo que hay que medir y no se mide»** (brechas de medición para la triple hélice academia–empresa–gobierno).
- Sitio **estático** (Vite + React + TypeScript + ECharts + MapLibre GL), sin backend; los datos viven en JSON versionables (`src/data/catalog.json` y `src/data/regional/*.json`) que los investigadores pueden actualizar editando archivos.
- Todo el contenido está en **español**.
- Decisión en curso: los límites se van refinando uno a uno (a la fecha: Cambio climático e Integridad de la biosfera ya están en el nuevo formato; los demás conservan el formato previo).

## Brand Commitments

- Nombre de producto: **Salud Planetaria · Mar de Cortés**.
- Pertenece al **Observatorio Tecnológico del Mar de Cortés**.
- Logo vinculante: **Corredor Científico y Tecnológico del Mar de Cortés**.
- Red institucional: Foro Mar de Cortés + UABC, UABCS, UAN, UAS y Unison.

## Evidence on Hand

- Planetary Health Check 2026 (informe principal y materiales suplementarios) — base del estado global.
- Documentos de referencia por límite aportados por el usuario (p. ej., `Cambio_climatico_MdC.pdf`, `Cambio climático resumen general.pdf`, `Biosfera Noroeste de México.pdf`).
- Datos regionales recopilados de fuentes públicas (INEGI, CONAGUA, CONABIO, CONAFOR, CONANP, CONAPESCA, SEMARNAT, SMN, INECC, NOAA, Global Forest Watch, etc.), con URL y fecha de acceso en `src/data/regional/*.json`.
- Directorio del Observatorio (universidades y responsables) extraído del sitio institucional.
- **Ausencia a no fabricar:** no hay testimonios, clientes ni casos de éxito de terceros.

## Product Principles

1. Cada dato se traza a una fuente pública (URL + fecha de acceso); nunca se inventan valores.
2. Se prioriza donde la región tiene impacto y apalancamiento reales; no se concentran recursos donde no hay impacto.
3. Contenido en español, claro y accesible para tomadores de decisiones e investigadores.
4. Datos abiertos y versionables: el sitio es estático y actualizable editando archivos.
5. Identidad institucional del Observatorio/Corredor (cinco universidades + Foro Mar de Cortés).

## Accessibility & Inclusion

Paleta apta para daltónicos, textos alternativos en visualizaciones, y degradación elegante sin WebGL (el contenido sigue visible aunque el mapa no cargue). Idioma español como requisito.
