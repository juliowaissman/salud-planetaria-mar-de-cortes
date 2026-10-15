import catalogRaw from './catalog.json'
import type { Catalog } from '../types'

export const catalog = catalogRaw as unknown as Catalog

export const boundaryById = new Map(catalog.boundaries.map((b) => [b.id, b]))
export const spotlightById = new Map(catalog.spotlights.map((s) => [s.id, s]))
export const controlVariableById = new Map(catalog.controlVariables.map((c) => [c.id, c]))
export const sourceById = new Map(catalog.sources.map((s) => [s.id, s]))
export const stateById = new Map(catalog.states.map((s) => [s.id, s]))

export function controlVariablesOf(boundaryId: string) {
  return catalog.controlVariables.filter((c) => c.boundaryId === boundaryId)
}
