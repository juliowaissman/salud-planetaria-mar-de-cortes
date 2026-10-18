// Utilidades compartidas por las páginas editoriales (límites y temas emergentes).
import type { Action } from '../types'

export const ACTOR: Record<Action['actor'], { label: string; cls: string }> = {
  'gobierno-local': { label: 'Gobierno', cls: 'gobierno' },
  'iniciativa-privada': { label: 'Iniciativa privada', cls: 'privado' },
  academia: { label: 'Academia', cls: 'academia' },
  sociedad: { label: 'Sociedad', cls: 'sociedad' },
}
export const ACTOR_ORDER: Action['actor'][] = ['gobierno-local', 'iniciativa-privada', 'academia', 'sociedad']

export function groupByActor(actions: Action[]) {
  return ACTOR_ORDER.map((actor) => ({ actor, items: actions.filter((a) => a.actor === actor) })).filter((g) => g.items.length > 0)
}

// El sitio usa HashRouter: se desplaza con JS en lugar de anclas #id
export function goTo(sid: string) {
  const el = document.getElementById(sid)
  if (!el) return
  if (el instanceof HTMLDetailsElement) el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const SCOPE_LABEL = { global: 'Mundo', nacional: 'México', regional: 'Mar de Cortés' } as const
