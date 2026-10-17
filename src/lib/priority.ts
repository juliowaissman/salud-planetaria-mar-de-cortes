import type { Boundary, CriterionId, Priority, Rating } from '../types'

// Método de priorización regional (una sola fuente de verdad).
// Adaptado de la calificación de amenazas de los Estándares Abiertos para la
// Práctica de la Conservación (alcance, severidad, irreversibilidad) y del
// criterio de escala de Häyhä et al. (2016) para el apalancamiento.
// Cada criterio se califica de 1 a 4; cada eje es la media geométrica de sus
// tres criterios, de modo que un criterio bajo no se compensa con otros altos.

export interface Criterion {
  id: CriterionId
  axis: 'impact' | 'leverage'
  name: string
  question: string
  levels: Record<1 | 2 | 3 | 4, string>
}

export const CRITERIA: Criterion[] = [
  {
    id: 'alcance',
    axis: 'impact',
    name: 'Alcance',
    question: '¿Qué parte de la región está afectada?',
    levels: {
      4: 'Los cinco estados o la mayor parte del Golfo de California.',
      3: 'Tres o cuatro estados, o la mayor parte de un sistema clave (costa, valles agrícolas, ciudades).',
      2: 'Uno o dos estados, o zonas localizadas.',
      1: 'Sitios puntuales o sin afectación documentada.',
    },
  },
  {
    id: 'severidad',
    axis: 'impact',
    name: 'Severidad',
    question: '¿Qué tan grave es el daño documentado en la región?',
    levels: {
      4: 'Daños graves documentados: muertes, colapso de pesquerías o especies al borde de la extinción.',
      3: 'Deterioro medible y persistente del ecosistema o exposición humana documentada.',
      2: 'Señales moderadas, episódicas o solo indirectas.',
      1: 'Sin daño regional documentado.',
    },
  },
  {
    id: 'irreversibilidad',
    axis: 'impact',
    name: 'Irreversibilidad',
    question: 'Si la presión se detiene, ¿cuánto tarda en recuperarse?',
    levels: {
      4: 'Irreversible o más de 100 años (extinciones, acuíferos salinizados, CO₂ acumulado).',
      3: 'Entre 20 y 100 años.',
      2: 'Entre 5 y 20 años.',
      1: 'Menos de 5 años.',
    },
  },
  {
    id: 'control',
    axis: 'leverage',
    name: 'Control regional de las causas',
    question: '¿Qué parte de las causas se origina en la región?',
    levels: {
      4: 'Las causas principales son regionales (agricultura, pesca, acuacultura, residuos, fuentes locales).',
      3: 'La mayoría de las causas son regionales, con aportes externos importantes.',
      2: 'Causas mixtas: una parte decisiva viene de fuera de la región.',
      1: 'Causa global: la región aporta una fracción mínima.',
    },
  },
  {
    id: 'competencia',
    axis: 'leverage',
    name: 'Competencia de los actores regionales',
    question: '¿Los instrumentos para actuar están en manos de gobiernos estatales y municipales, empresas y organizaciones de la región?',
    levels: {
      4: 'Sí: ordenamiento territorial, permisos estatales o municipales y decisiones productivas privadas.',
      3: 'El instrumento principal es federal, pero se aplica o se negocia en la región.',
      2: 'Depende sobre todo de decisiones federales o binacionales.',
      1: 'Depende de acuerdos internacionales.',
    },
  },
  {
    id: 'factibilidad',
    axis: 'leverage',
    name: 'Factibilidad de soluciones',
    question: '¿Hay soluciones probadas y viables?',
    levels: {
      4: 'Probadas en la propia región y con beneficios económicos.',
      3: 'Probadas en otras regiones, con costo moderado.',
      2: 'Costosas, de efecto incierto o solo de monitoreo.',
      1: 'No hay soluciones regionales efectivas.',
    },
  },
]

export const IMPACT_CRITERIA = CRITERIA.filter((c) => c.axis === 'impact')
export const LEVERAGE_CRITERIA = CRITERIA.filter((c) => c.axis === 'leverage')

/** Umbrales de nivel sobre la escala de 1 a 4. */
export const LEVEL_THRESHOLDS = { alto: 3, medio: 2 }

export function geometricMean(values: number[]): number {
  return Math.pow(values.reduce((a, v) => a * v, 1), 1 / values.length)
}

export function levelOf(score: number): Rating {
  if (score >= LEVEL_THRESHOLDS.alto) return 'Alto'
  if (score >= LEVEL_THRESHOLDS.medio) return 'Medio'
  return 'Bajo'
}

// Regla no compensatoria: Alta solo si ambos ejes son altos; Baja si alguno es bajo.
export function priorityOf(impact: Rating, leverage: Rating): Priority {
  if (impact === 'Alto' && leverage === 'Alto') return 'Alta'
  if (impact === 'Bajo' || leverage === 'Bajo') return 'Baja'
  return 'Media'
}

const PRIORITY_RANK: Record<Priority, number> = { Alta: 3, Media: 2, Baja: 1 }

export interface Assessment {
  impact: number
  leverage: number
  impactLevel: Rating
  leverageLevel: Rating
  priority: Priority
  /** true si ningún cambio de ±1 en un solo criterio modifica la prioridad */
  robust: boolean
  /** cambios de un criterio que sí modifican la prioridad, p. ej. «Severidad +1 → Alta» */
  sensitiveTo: string[]
}

function classify(values: Record<CriterionId, number>) {
  const impact = geometricMean(IMPACT_CRITERIA.map((c) => values[c.id]))
  const leverage = geometricMean(LEVERAGE_CRITERIA.map((c) => values[c.id]))
  const impactLevel = levelOf(impact)
  const leverageLevel = levelOf(leverage)
  return { impact, leverage, impactLevel, leverageLevel, priority: priorityOf(impactLevel, leverageLevel) }
}

export function assess(b: Pick<Boundary, 'regional'>): Assessment | null {
  const s = b.regional.scores
  if (!s) return null
  const values = Object.fromEntries(CRITERIA.map((c) => [c.id, s[c.id].value])) as Record<CriterionId, number>
  const base = classify(values)
  const sensitiveTo: string[] = []
  for (const c of CRITERIA) {
    for (const d of [-1, 1]) {
      const v = values[c.id] + d
      if (v < 1 || v > 4) continue
      const alt = classify({ ...values, [c.id]: v })
      if (alt.priority !== base.priority) sensitiveTo.push(`${c.name} ${d > 0 ? '+1' : '−1'} → ${alt.priority}`)
    }
  }
  return { ...base, robust: sensitiveTo.length === 0, sensitiveTo }
}

/** Prioridad de un límite: usa los criterios si existen y, si no, los niveles declarados. */
export function boundaryPriority(b: Pick<Boundary, 'regional'>): Priority {
  return assess(b)?.priority ?? priorityOf(b.regional.impact, b.regional.leverage)
}

/** Orden: prioridad, luego producto impacto × apalancamiento. */
export function compareByPriority(a: Pick<Boundary, 'regional'>, b: Pick<Boundary, 'regional'>): number {
  const pa = boundaryPriority(a)
  const pb = boundaryPriority(b)
  if (pa !== pb) return PRIORITY_RANK[pb] - PRIORITY_RANK[pa]
  const ea = assess(a)
  const eb = assess(b)
  return (eb ? eb.impact * eb.leverage : 0) - (ea ? ea.impact * ea.leverage : 0)
}
