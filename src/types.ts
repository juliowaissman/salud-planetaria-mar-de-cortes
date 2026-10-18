export type Status = 'safe' | 'increasing-risk' | 'high-risk' | 'not-quantified'
export type Trend = 'worsening' | 'stable' | 'improving' | 'unknown'
export type Rating = 'Alto' | 'Medio' | 'Bajo'
export type Priority = 'Alta' | 'Media' | 'Baja'

export interface ControlVariable {
  id: string
  boundaryId: string
  name: string
  nameEn?: string
  globalValue: string
  unit?: string
  safeBoundary?: string
  highRisk?: string
  status: Status
  trend: Trend
  note?: string
}

export interface Action {
  actor: 'iniciativa-privada' | 'gobierno-local' | 'academia' | 'sociedad'
  text: string
}

export interface OpenQuestion {
  q: string
  action: string
  actor?: 'iniciativa-privada' | 'gobierno-local' | 'academia' | 'sociedad'
  /** Obras que respaldan la pregunta; ids de las fuentes del límite */
  refIds?: string[]
}

export type CriterionId = 'alcance' | 'severidad' | 'irreversibilidad' | 'control' | 'competencia' | 'factibilidad'

export interface CriterionScore {
  value: 1 | 2 | 3 | 4
  why: string
}

export interface RegionalAssessment {
  summary: string
  impact: Rating
  leverage: Rating
  priority: Priority
  priorityScore: number // 1..3 used for ordering
  // Calificación de los seis criterios del método de priorización (ver src/lib/priority.ts)
  scores?: Record<CriterionId, CriterionScore>
  actions: Action[]
  questions?: OpenQuestion[]
  measurementGaps?: string[]
  dataGaps?: string
}

export interface Boundary {
  id: string
  order: number
  name: string
  nameEn: string
  short: string
  status: Status
  trend: Trend
  globalStatus: string
  controlVariableIds: string[]
  regional: RegionalAssessment
  hasMap: boolean
  /** Pregunta guía (encabezado de la página) */
  question: string
  /** Mensaje central, en lenguaje claro */
  message: string
  /** Cifras clave; scope indica si la cifra es global, nacional o regional */
  figures: SpotlightFigure[]
  mechanism: { title: string; intro?: string; steps: SpotlightStep[] }
  relatedBoundaryIds: string[]
}

// ---------- Temas emergentes (capítulos «Spotlight» del PHC 2026) ----------

/**
 * Referencia bibliográfica en campos separados; src/lib/cite.tsx la arma en formato APA 7 (en español).
 * Autores personales: "Apellido, A. B.". Autores institucionales: nombre completo con la sigla entre
 * corchetes, "Comisión Nacional del Agua [CONAGUA]"; la cita en el texto usa la sigla.
 */
export interface Reference {
  id: string
  kind: 'articulo' | 'libro' | 'capitulo' | 'informe' | 'datos' | 'web' | 'tesis' | 'comunicado' | 'norma'
  authors: string[]
  /** Cuando los autores son compiladores o editores: "Comps.", "Eds." */
  authorsRole?: string
  /** Etiqueta para la cita en el texto cuando no hay autor (leyes, laudos, capítulos anónimos) */
  citeAs?: string
  /** "2019", "s. f." o un intervalo "2020–2026" */
  year: string
  /** Día y mes de comunicados y notas: "29 de septiembre" */
  date?: string
  title: string
  /** Revista, libro (en capítulos) o sitio web; va en cursiva */
  container?: string
  editors?: string[]
  /** "Comps." si son compiladores; por omisión "Eds." o "Ed." */
  editorsRole?: string
  volume?: string
  issue?: string
  pages?: string
  /** Número de artículo (e8790, 102746…) cuando no hay páginas */
  article?: string
  /** Descripción entre corchetes: [Conjunto de datos], [Tesis de maestría, Universidad X]… */
  description?: string
  publisher?: string
  /** DOI sin prefijo; se muestra como https://doi.org/… */
  doi?: string
  /** Sólo cuando no hay DOI */
  url?: string
  /** Fecha de consulta (AAAA-MM-DD), sólo para contenido que cambia: bases de datos y páginas web */
  accessed?: string
  /** Anotación del sitio (qué dato se tomó de la fuente); se muestra aparte de la cita */
  note?: string
  group?: 'global' | 'regional'
}

export interface SpotlightFigure {
  value: string
  label: string
  refId?: string
  scope?: 'global' | 'nacional' | 'regional'
}

export interface SpotlightFinding {
  title: string
  text: string
  /** Estados o lugares involucrados */
  where?: string
  /** Solo en entidades nuevas: impacto conocido o amenaza desconocida */
  kind?: 'conocido' | 'desconocido'
  refIds?: string[]
}

export interface SpotlightStep {
  title: string
  text: string
  tone?: 'gain' | 'loss' | 'neutral'
}

export interface SpotlightChart {
  type: 'bar' | 'line' | 'hbar'
  /** Barras apiladas (solo con varias series) */
  stacked?: boolean
  title: string
  subtitle?: string
  unit: string
  categories: string[]
  series: { name: string; values: (number | null)[] }[]
  note?: string
  refId?: string
}

export interface Spotlight {
  id: string
  order: number
  name: string
  nameEn: string
  /** Resumen de una o dos frases para la tarjeta del índice */
  summary: string
  /** Título corto para navegación */
  short: string
  /** Pregunta guía del tema */
  question: string
  motif: 'land' | 'seafloor' | 'chemicals'
  /** Capítulo y autores en el PHC 2026 */
  chapter: string
  /** Mensaje central, en lenguaje claro */
  message: string
  phc: { points: string[]; quote?: string }
  mechanism: { title: string; intro?: string; steps: SpotlightStep[] }
  figures: SpotlightFigure[]
  findings: SpotlightFinding[]
  chart?: SpotlightChart
  regional: RegionalAssessment
  relatedBoundaryIds: string[]
  references: Reference[]
}

/** Las fuentes de los límites usan el mismo tipo que las referencias de los temas emergentes */
export type Source = Reference

export interface RegionState {
  id: string
  name: string
  university: string
}

export interface KeyTakeaway {
  n: number
  text: string
}

export interface DirectoryPerson {
  name: string
  role: string
  photo?: string
}

export interface DirectoryOrg {
  id: string
  name: string
  logo: string
  wide?: boolean
  members: DirectoryPerson[]
  note?: string
}

export interface Catalog {
  title: string
  subtitle: string
  updated: string
  basedOn: string
  states: RegionState[]
  boundaries: Boundary[]
  controlVariables: ControlVariable[]
  spotlights: Spotlight[]
  keyTakeaways: KeyTakeaway[]
  sources: Source[]
  directory: DirectoryOrg[]
}

export interface SeriesPoint {
  label: string
  value: number | null
}

export interface StateValue {
  stateId: string
  value: number | null
  unit?: string
  note?: string
}

export interface Series {
  id: string
  title: string
  unit?: string
  kind?: 'line' | 'bar'
  note?: string
  points: SeriesPoint[]
}

export interface MapTooltipBar {
  label: string
  value: number | null
}

export interface MapSpec {
  kind: 'choropleth'
  title: string
  unit?: string
  sourceId: string
  valuesByState: Record<string, number | null>
  note?: string
  tooltip?: {
    label?: string
    barsByState?: Record<string, MapTooltipBar[]>
  }
}

export interface StateGroup {
  id: string
  title: string
  unit?: string
  note?: string
  values: StateValue[]
}

export interface ChartBlock {
  title: string
  subtitle?: string
  note?: string
  series: Series[]
}

export interface RegionalData {
  boundaryId: string
  updated?: string
  charts?: ChartBlock[]
  series?: Series[]
  seriesTitle?: string
  seriesNote?: string
  stateValues?: StateValue[]
  stateTitle?: string
  stateNote?: string
  stateGroups?: StateGroup[]
  map?: MapSpec
  sources?: Source[]
}
