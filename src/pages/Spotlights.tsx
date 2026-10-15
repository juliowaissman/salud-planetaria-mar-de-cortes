import { Link, useParams } from 'react-router-dom'
import { catalog, boundaryById, spotlightById, sourceById } from '../data'
import { getRegional } from '../data/regional'
import type { Source } from '../types'
import { PriorityBadge } from '../components/StatusBadge'
import ActionList from '../components/ActionList'
import { SourceList } from '../components/SourceList'
import { priorityOf } from '../lib/priority'

function SpotlightCard({ id }: { id: string }) {
  const s = spotlightById.get(id)
  if (!s) return null
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="tag-row"><PriorityBadge priority={priorityOf(s.regional.impact, s.regional.leverage)} /></div>
      <h2><Link to={`/spotlights/${s.id}`}>{s.name}</Link></h2>
      <p className="muted small">{s.nameEn}</p>
      <p className="prose">{s.summary}</p>
    </div>
  )
}

export default function Spotlights() {
  const { id } = useParams()
  if (id) {
    const s = spotlightById.get(id)
    if (!s) return <div className="container section"><p>No encontrado. <Link to="/spotlights">Volver</Link>.</p></div>
    const related = s.relatedBoundaryIds.map((bid) => boundaryById.get(bid)).filter(Boolean)
    const sources: Source[] = ['phc-main', 'phc-supp']
      .map((sid) => sourceById.get(sid))
      .filter((x): x is Source => Boolean(x))
      .concat(s.relatedBoundaryIds.flatMap((bid) => getRegional(bid)?.sources ?? []))
    return (
      <div className="container section">
        <nav className="small muted" style={{ marginBottom: 12 }}>
          <Link to="/spotlights">Análisis a fondo</Link> › {s.name}
        </nav>
        <div className="tag-row"><PriorityBadge priority={priorityOf(s.regional.impact, s.regional.leverage)} /></div>
        <h1>{s.name}</h1>
        <p className="muted">{s.nameEn}</p>
        <div className="card"><p className="prose" style={{ margin: 0 }}>{s.regional.summary}</p></div>
        <div className="card" style={{ marginTop: 16 }}>
          <h2>¿Qué puede hacer la región?</h2>
          <ActionList actions={s.regional.actions} />
        </div>
        {s.regional.dataGaps && <div className="note" style={{ marginTop: 16 }}><strong>Limitaciones:</strong> {s.regional.dataGaps}</div>}
        {related.length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <h2>Límites relacionados</h2>
            {related.map((b) => (
              <div key={b!.id} style={{ margin: '6px 0' }}>
                <Link to={`/limites/${b!.id}`}>{b!.name}</Link>
              </div>
            ))}
          </div>
        )}
        {sources.length > 0 && (
          <details className="card" style={{ marginTop: 16 }}>
            <summary>
              <h2 style={{ display: 'inline', margin: 0 }}>Fuentes y referencias ({sources.length})</h2>
            </summary>
            <SourceList items={sources} />
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="container section">
      <h1>Análisis a fondo</h1>
      <p className="muted page-intro">
        Tres temas emergentes destacados por el Planetary Health Check 2026, con lectura para el Mar de Cortés.
      </p>
      {catalog.spotlights.map((s) => <SpotlightCard key={s.id} id={s.id} />)}
    </div>
  )
}
