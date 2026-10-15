import type { Priority, Rating } from '../types'

const SCORE: Record<Rating, number> = { Alto: 3, Medio: 2, Bajo: 1 }

export function priorityScoreOf(impact: Rating, leverage: Rating): number {
  return SCORE[impact] * SCORE[leverage]
}

// Prioridad derivada de impacto × apalancamiento (una sola fuente de verdad).
// Alto impacto + apalancamiento ≥ medio ⇒ Alta; el resto sigue el producto.
export function priorityOf(impact: Rating, leverage: Rating): Priority {
  const s = priorityScoreOf(impact, leverage)
  if (s >= 6) return 'Alta'
  if (s >= 3) return 'Media'
  return 'Baja'
}
