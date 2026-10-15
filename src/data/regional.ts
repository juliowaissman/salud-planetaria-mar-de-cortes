import type { RegionalData } from '../types'

const modules = import.meta.glob('./regional/*.json', { eager: true }) as Record<string, unknown>

function asRegional(v: unknown): RegionalData | undefined {
  if (v && typeof v === 'object') return v as RegionalData
  return undefined
}

export function getRegional(id: string): RegionalData | undefined {
  for (const [path, mod] of Object.entries(modules)) {
    const base = path.split('/').pop()?.replace(/\.json$/, '')
    if (base === id) {
      const val = (mod as { default?: unknown }).default ?? mod
      return asRegional(val)
    }
  }
  return undefined
}

export function regionalIds(): string[] {
  return Object.keys(modules)
    .map((p) => p.split('/').pop()?.replace(/\.json$/, '') ?? '')
    .filter(Boolean)
}
