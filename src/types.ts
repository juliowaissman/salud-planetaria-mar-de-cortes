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
  ref?: string
}

export interface RegionalAssessment {
  summary: string
  impact: Rating
  leverage: Rating
  priority: Priority
  priorityScore: number // 1..3 used for ordering
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
}

export interface Spotlight {
  id: string
  order: number
  name: string
  nameEn: string
  summary: string
  regional: RegionalAssessment
  relatedBoundaryIds: string[]
}

export interface Source {
  id: string
  title: string
  organization: string
  url: string
  accessDate: string
  license?: string
  note?: string
  group?: 'global' | 'regional'
}

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
