// Referencias en formato APA 7 (adaptación al español).
// Las referencias se guardan en campos separados (ver Reference en src/types.ts) y aquí se arman.
import { Fragment, type ReactNode } from 'react'
import type { Reference } from '../types'
import { goTo } from './editorial'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/** 2026-10-17 → 17 de octubre de 2026 */
function fechaLarga(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${y}`
}

/** Une una lista al estilo APA en español: «A», «A y B», «A, B y C» */
function joinY(xs: string[]) {
  if (xs.length <= 1) return xs.join('')
  return `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`
}

/** Lista de autores: hasta 20 completos; con 21 o más, los primeros 19, puntos suspensivos y el último */
function authorList(authors: string[]) {
  if (authors.length >= 21) return `${authors.slice(0, 19).join(', ')}, . . . ${authors[authors.length - 1]}`
  return joinY(authors)
}

/** «Kitzmann, N.» → «N. Kitzmann» (editores van con la inicial adelante) */
function editorName(a: string) {
  const i = a.indexOf(', ')
  return i < 0 ? a : `${a.slice(i + 2)} ${a.slice(0, i)}`
}

/** Apellido o nombre corto para la cita en el texto */
function shortName(a: string) {
  const abbr = a.match(/\[([^\]]+)\]$/)
  if (abbr) return abbr[1]
  const i = a.indexOf(', ')
  return i < 0 ? a : a.slice(0, i)
}

function citeAuthor(r: Reference) {
  const a = r.authors
  if (a.length === 0) return r.citeAs ?? r.title
  if (a.length === 1) return shortName(a[0])
  if (a.length === 2) return `${shortName(a[0])} y ${shortName(a[1])}`
  return `${shortName(a[0])} et al.`
}

function sortKey(r: Reference) {
  const first = r.authors[0] ?? r.title
  return `${first} ${r.year} ${r.title}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export interface CiteKey {
  /** «Ezcurra et al.» */
  author: string
  /** «2016», o «2012a» cuando dos obras coinciden en autor y año */
  year: string
}

/**
 * Ordena las referencias como pide APA (alfabético por primer autor) y calcula la etiqueta de cada una
 * para la cita en el texto, con letras a, b… si dos obras tienen el mismo autor y año.
 */
export function prepareReferences(refs: Reference[]) {
  const sorted = [...refs].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'es'))
  const keys = new Map<string, CiteKey>()
  const groups = new Map<string, Reference[]>()
  for (const r of sorted) {
    const k = `${citeAuthor(r)}|${r.year}`
    groups.set(k, [...(groups.get(k) ?? []), r])
  }
  for (const list of groups.values()) {
    list.forEach((r, i) => {
      const suffix = list.length > 1 && /^\d{4}$/.test(r.year) ? String.fromCharCode(97 + i) : ''
      keys.set(r.id, { author: citeAuthor(r), year: r.year + suffix })
    })
  }
  return { sorted, keys }
}

/** Enlace de la referencia: el DOI si lo tiene, si no la URL */
export function refHref(r: Reference) {
  return r.doi ? `https://doi.org/${r.doi}` : r.url
}

/** Crédito breve para pies de sección: «Caesar et al. (2026). *Título*. Editorial.» */
export function ShortReference({ r }: { r: Reference }) {
  return (
    <>
      {citeAuthor(r)} ({r.year}). <em>{r.title}</em>.{r.publisher ? ` ${dot(r.publisher)}` : ''}
    </>
  )
}

function Link({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {href}
    </a>
  )
}

/** Termina una parte con punto, salvo que ya acabe en signo de puntuación */
function dot(s: string) {
  return /[.?!]$/.test(s) ? s : `${s}.`
}

/** Una referencia completa en formato APA 7 */
export function ApaReference({ r, year }: { r: Reference; year?: string }) {
  const y = year ?? r.year
  const when = `(${r.date ? `${y}, ${r.date}` : y}).`
  const role = r.authorsRole ? ` (${r.authorsRole})` : ''
  const authorPart = r.authors.length ? `${dot(authorList(r.authors) + role)} ` : ''
  const desc = r.description ? ` [${r.description}]` : ''
  const parts: ReactNode[] = []

  const titleItalic = r.kind !== 'articulo' && r.kind !== 'capitulo'
  const titleNode = titleItalic ? (
    <>
      <em>{r.title}</em>
      {desc}
    </>
  ) : (
    <>
      {r.title}
      {desc}
    </>
  )
  const titleEnd = /[.?!]$/.test(r.title) && !desc ? ' ' : '. '

  if (r.authors.length) {
    parts.push(authorPart, when, ' ', titleNode, titleEnd)
  } else {
    // Sin autor: el título pasa al lugar del autor
    parts.push(titleNode, titleEnd, when, ' ')
  }

  if (r.kind === 'articulo') {
    if (r.container) {
      const vol = r.volume ? (
        <>
          , <em>{r.volume}</em>
          {r.issue ? `(${r.issue})` : ''}
        </>
      ) : r.issue ? `, (${r.issue})` : null
      const loc = r.pages ?? r.article
      parts.push(
        <em key="c">{r.container}</em>,
        vol,
        loc ? `, ${loc}` : '',
        '. ',
      )
    }
  } else if (r.kind === 'capitulo') {
    const eds = r.editors ?? []
    const role = r.editorsRole ?? (eds.length > 1 ? 'Eds.' : 'Ed.')
    parts.push(
      'En ',
      eds.length ? `${joinY(eds.map(editorName))} (${role}), ` : '',
      <em key="c">{r.container}</em>,
      r.pages ? ` (pp. ${r.pages})` : '',
      '. ',
    )
    if (r.publisher) parts.push(dot(r.publisher), ' ')
  } else {
    if (r.container) parts.push(r.kind === 'norma' ? <em key="c">{r.container}</em> : r.container, '. ')
    if (r.publisher) parts.push(dot(r.publisher), ' ')
  }

  const href = refHref(r)
  if (href) {
    if (r.accessed && !r.doi) parts.push(`Consultado el ${fechaLarga(r.accessed)}, de `)
    parts.push(<Link key="u" href={href} />)
  }

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  )
}

/** Lista de referencias ordenada; cada entrada tiene id `${prefix}-${ref.id}` para enlazar las citas */
export function ReferenceList({ refs, prefix, showNotes = false }: { refs: Reference[]; prefix: string; showNotes?: boolean }) {
  const { sorted, keys } = prepareReferences(refs)
  return (
    <ul className="ref-list apa">
      {sorted.map((r) => (
        <li key={r.id} id={`${prefix}-${r.id}`}>
          <ApaReference r={r} year={keys.get(r.id)?.year} />
          {showNotes && r.note && <span className="ref-note">{r.note}</span>}
        </li>
      ))}
    </ul>
  )
}

/** Citas en el texto, p. ej. (Ezcurra et al., 2016; CONAGUA, 2024); cada una lleva a su referencia. Con `bare`, sin paréntesis */
export function Cites({ ids, refs, prefix, bare = false }: { ids?: string[]; refs: Reference[]; prefix: string; bare?: boolean }) {
  if (!ids || ids.length === 0) return null
  const { sorted, keys } = prepareReferences(refs)
  // APA: dentro del paréntesis, en el mismo orden alfabético que la lista
  const order = new Map(sorted.map((r, i) => [r.id, i]))
  const found = ids.filter((id) => keys.has(id)).sort((a, b) => order.get(a)! - order.get(b)!)
  if (found.length === 0) return null
  // APA: obras del mismo autor se agrupan, «López-Martínez et al., 2012a, 2012b»
  const groups: { author: string; ids: string[] }[] = []
  for (const id of found) {
    const k = keys.get(id)!
    const last = groups[groups.length - 1]
    if (last && last.author === k.author) last.ids.push(id)
    else groups.push({ author: k.author, ids: [id] })
  }
  return (
    <span className="cite">
      {bare ? ' ' : ' ('}
      {groups.map((g, gi) => (
        <Fragment key={g.ids[0]}>
          {gi > 0 && '; '}
          {g.ids.map((id, i) => (
            <Fragment key={id}>
              {i > 0 && ', '}
              {/* Enlace (no botón) para que la cita pueda partirse entre líneas; el router usa el hash, por eso se evita la navegación */}
              <a
                href={`#${prefix}-${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  goTo(`${prefix}-${id}`)
                }}
              >
                {i === 0 ? `${g.author}, ` : ''}
                {keys.get(id)!.year}
              </a>
            </Fragment>
          ))}
        </Fragment>
      ))}
      {bare ? '' : ')'}
    </span>
  )
}
