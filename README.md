# Salud Planetaria · Mar de Cortés

Dashboard regional interactivo de los **límites planetarios** para los cinco estados del Mar de Cortés:
**Baja California, Baja California Sur, Sonora, Sinaloa y Nayarit**.

El sitio regionaliza el **Planetary Health Check 2026** (Potsdam Institute for Climate Impact Research / PBScience)
a la escala regional: estado global de los 9 límites y sus 13 variables de control, diagnóstico regional, gráficas,
mapas, referencias accesibles y una matriz de **priorización impacto × apalancamiento** para decidir dónde concentrar
los esfuerzos de la iniciativa privada y los gobiernos locales.

## Stack

- **Vite + React 18 + TypeScript** (sitio estático, sin backend).
- **ECharts** para gráficas (series temporales, comparativas por estado, matriz de dispersión).
- **MapLibre GL** para mapas coropléticos por estado (mapa base vectorial **OpenFreeMap** estilo Positron, sin API key; con respaldo raster de CARTO).
- Datos en **JSON estático** en `src/data/` (sin llamadas a APIs en tiempo de ejecución, salvo los tiles del mapa).

## Uso

```bash
npm install          # instala dependencias
npm run dev          # servidor de desarrollo (http://localhost:5173)
npm run build        # compila a dist/
npm run preview      # sirve el build de producción localmente
```

El enrutado usa `HashRouter`, por lo que `dist/` se puede publicar en **GitHub Pages, Netlify, Cloudflare Pages** o
cualquier hosting estático **sin configuración de servidor** (las URLs usan `#/ruta`).

## Despliegue en GitHub Pages

El build usa `base: './'` (rutas relativas) y `HashRouter`, así que funciona en cualquier sub-ruta
(`usuario.github.io/repo/`) sin tocar configuración.

### Opción recomendada: GitHub Actions (automático)

1. Crea un repositorio en GitHub y sube el código a la rama `main`.
2. En el repositorio ve a **Settings → Pages**.
3. En **Build and deployment → Source** elige **GitHub Actions**.
4. Empuja a `main`: el workflow `.github/workflows/deploy.yml` compila y publica `dist/` solo.
5. La URL aparece en **Settings → Pages** (o en el log de la acción): `https://<usuario>.github.io/<repo>/`.

### Alternativa manual (rama `gh-pages`)

```bash
npm install
npm run build
git add -f dist
git commit -m "deploy: build estático"
git subtree push --prefix dist origin gh-pages
```

Y en **Settings → Pages** elige la rama `gh-pages` con carpeta `/`.

## Estructura de datos

```
src/
  data/
    catalog.json          # Metadatos: 9 límites, 13 variables de control, 3 spotlights, estados, fuentes
    regional/<id>.json    # Datos regionales por límite (series, valores por estado, mapa)
    index.ts              # Cargador tipado del catálogo
    regional.ts           # Cargador de datos regionales (import.meta.glob)
  components/             # StatusBadge, PlanetaryBar, PriorityMatrix, gráficas, mapa, listas
  pages/                  # Home, Boundaries, BoundaryDetail, Spotlights, Prioritization, Sources, About
public/
  geo/states.json         # GeoJSON de los 32 estados de México (Natural Earth, dominio público)
```

### Esquema de un archivo regional (`src/data/regional/<id>.json`)

```json
{
  "boundaryId": "freshwater-change",
  "updated": "2026-10-03",
  "stateValues": [
    { "stateId": "son", "value": 12, "unit": "acuíferos sobreexplotados", "note": "CONAGUA 2024" },
    { "stateId": "bc", "value": null, "unit": "acuíferos sobreexplotados", "note": "no verificado" }
  ],
  "series": [
    { "id": "s1", "title": "Título", "unit": "unidad", "points": [{ "label": "2020", "value": 1 }] }
  ],
  "map": {
    "kind": "choropleth",
    "title": "Título del mapa",
    "unit": "unidad",
    "sourceId": "id-fuente",
    "valuesByState": { "son": 12, "bc": null, "bcs": null, "sin": null, "nay": null }
  },
  "sources": [
    { "id": "id-fuente", "title": "Título", "organization": "Organización", "url": "https://...", "accessDate": "2026-10-03", "note": "..." }
  ]
}
```

IDs de estados: `bc` (Baja California), `bcs` (Baja California Sur), `son` (Sonora), `sin` (Sinaloa), `nay` (Nayarit).

## Cómo actualizar datos

1. Edita el archivo `src/data/regional/<id>.json` correspondiente al indicador.
2. Cada número debe incluir su fuente en `sources` (URL + `accessDate`).
3. Si un dato no existe a escala estatal, usa `"value": null` con una `note` (nunca inventar valores).
4. Recompila: `npm run build`.

Para añadir un límite nuevo, edita `catalog.json` y crea su `regional/<id>.json`.

## Fuentes y atribución

- **Estado global:** Planetary Health Check 2026 (Potsdam Institute for Climate Impact Research / PBScience) y el marco
  de límites planetarios (Rockström et al. 2009; Steffen et al. 2015; Richardson et al. 2023).
- **Datos regionales:** fuentes públicas mexicanas (INEGI, CONAGUA, CONABIO, CONAFOR, CONANP, CONAPESCA, SMN, SIAP,
  INECC, SEMARNAT) e internacionales (NOAA, FAO, Global Forest Watch, NASA), citadas en cada indicador con fecha de acceso.
- **Cartografía:** Natural Earth (dominio público) para los límites estatales; mapa base vectorial OpenFreeMap
  (© OpenFreeMap © OpenStreetMap contributors), con respaldo raster de CARTO.

## Priorización

Cada límite tiene en `catalog.json` (`regional.scores`) seis criterios calificados de 1 a 4 con su justificación:
alcance, severidad e irreversibilidad (impacto) y control regional de las causas, competencia de los actores
regionales y factibilidad de soluciones (apalancamiento). `src/lib/priority.ts` calcula cada eje como la media
geométrica de sus criterios, asigna el nivel (alto ≥ 3, medio ≥ 2, bajo < 2), clasifica la prioridad (alta solo si
ambos ejes son altos; baja si alguno es bajo) y hace la prueba de sensibilidad. Los campos `impact`, `leverage` y
`priority` del catálogo deben coincidir con ese cálculo; la metodología completa se explica en la página de
priorización.

## Temas emergentes

Los tres capítulos «Spotlight» del PHC 2026 están en `catalog.json` (`spotlights`). Cada uno tiene, además del
resumen: pregunta guía (`question`), mensaje central (`message`), puntos clave del informe (`phc`), los pasos del
mecanismo (`mechanism`), cuatro cifras clave (`figures`), hallazgos regionales (`findings`, con `kind` conocido o
desconocido en el de entidades nuevas), una gráfica (`chart`), la evaluación con los mismos seis criterios del
método de priorización (`regional.scores`), acciones por actor, vacíos de medición, límites relacionados y
referencias numeradas (`references`; los hallazgos y cifras las citan por `refIds`/`refId`). La ilustración de
cada tema está en `src/components/SpotlightArt.tsx`.
