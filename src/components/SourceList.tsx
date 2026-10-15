import type { Source } from '../types'

export function SourceList({ items }: { items: Source[] }) {
  if (items.length === 0) return null
  return (
    <ul className="source-list">
      {items.map((s) => (
        <li key={s.id}>
          <div className="src-title">{s.title}</div>
          <div className="src-meta">
            {s.organization} · acceso {s.accessDate}
            {s.license ? ` · ${s.license}` : ''}
          </div>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.url}
          </a>
          {s.note ? <div className="src-meta">{s.note}</div> : null}
        </li>
      ))}
    </ul>
  )
}
