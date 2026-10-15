import { Link, useParams } from 'react-router-dom'
import { boundaryById, controlVariablesOf, sourceById } from '../data'
import { getRegional } from '../data/regional'
import type { Source } from '../types'
import { StatusBadge, TrendBadge, PriorityBadge } from '../components/StatusBadge'
import ActionList from '../components/ActionList'
import QuestionList from '../components/QuestionList'
import { SourceList } from '../components/SourceList'
import TimeSeriesChart from '../components/TimeSeriesChart'
import StateBarChart from '../components/StateBarChart'
import StateChoropleth from '../components/StateChoropleth'
import { priorityOf } from '../lib/priority'

export default function BoundaryDetail() {
  const { id } = useParams()
  const b = id ? boundaryById.get(id) : undefined
  const regional = id ? getRegional(id) : undefined

  if (!b) {
    return (
      <div className="container section">
        <p>Límite no encontrado. <Link to="/limites">Volver a la lista</Link>.</p>
      </div>
    )
  }

  const cvs = controlVariablesOf(b.id)
  const priority = priorityOf(b.regional.impact, b.regional.leverage)
  const sources: Source[] = ['phc-main', 'phc-supp']
    .map((sid) => sourceById.get(sid))
    .filter((s): s is Source => Boolean(s))
    .concat(regional?.sources ?? [])

  return (
    <div className="container section">
      <nav className="small muted" style={{ marginBottom: 12 }}>
        <Link to="/limites">Límites planetarios</Link> › {b.name}
      </nav>

      <div className="tag-row">
        <StatusBadge status={b.status} />
        <TrendBadge trend={b.trend} />
        <PriorityBadge priority={priority} />
      </div>
      <h1>{b.name}</h1>
      <p className="muted">{b.nameEn} · Límite {b.order} de 9</p>
      <div className="note">{b.globalStatus}</div>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Diagnóstico regional (Mar de Cortés)</h2>
        <p className="prose">{b.regional.summary}</p>
        <div className="grid cols-3" style={{ marginTop: 8 }}>
          <div className="metric">
            <span className="value">{b.regional.impact}</span>
            <span className="label">Impacto regional</span>
          </div>
          <div className="metric">
            <span className="value">{b.regional.leverage}</span>
            <span className="label">Apalancamiento regional</span>
          </div>
          <div className="metric">
            <span className="value">{priority}</span>
            <span className="label">Prioridad</span>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Variables de control (global)</h2>
        <div className="grid cols-2">
          {cvs.map((cv) => (
            <div key={cv.id} className="cv-box">
              <div style={{ fontWeight: 600 }}>{cv.name}</div>
              <div className="mono cv-value">{cv.globalValue}</div>
              <div className="small muted">
                {cv.safeBoundary ? `Límite seguro: ${cv.safeBoundary}` : ''}
                {cv.safeBoundary && cv.highRisk ? ' · ' : ''}
                {cv.highRisk ? `Alto riesgo: ${cv.highRisk}` : ''}
                {!cv.safeBoundary && cv.note ? cv.note : ''}
              </div>
            </div>
          ))}
        </div>
      </section>

      {regional?.charts && regional.charts.length > 0 && (
        <>
          {regional.charts.map((c) => (
            <section className="card" key={c.title} style={{ marginTop: 16 }}>
              <h2>{c.title}</h2>
              {c.subtitle && <p className="chart-subtitle">{c.subtitle}</p>}
              <TimeSeriesChart series={c.series} />
              {c.note && <p className="chart-note">{c.note}</p>}
            </section>
          ))}
        </>
      )}

      {regional?.series && regional.series.length > 0 && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>{regional.seriesTitle ?? 'Series regionales'}</h2>
          {regional.series[0]?.unit && <p className="chart-subtitle">Variable dependiente: {regional.series[0].unit}</p>}
          <TimeSeriesChart series={regional.series} />
          {regional.seriesNote && <p className="chart-note">{regional.seriesNote}</p>}
        </section>
      )}

      {regional?.stateGroups && regional.stateGroups.length > 0 ? (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Comparación por estado</h2>
          {regional.stateGroups.map((g) => (
            <div key={g.id} style={{ marginTop: g.id === regional.stateGroups![0].id ? 0 : 20 }}>
              <h3>{g.title}</h3>
              {g.unit && <p className="chart-subtitle">Variable dependiente: {g.unit}</p>}
              <StateBarChart values={g.values} unit={g.unit} />
              {g.note && <p className="chart-note">{g.note}</p>}
            </div>
          ))}
        </section>
      ) : regional?.stateValues && regional.stateValues.some((v) => v.value != null) ? (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>{regional.stateTitle ?? 'Comparación por estado'}</h2>
          {regional.stateValues[0]?.unit && (
            <p className="chart-subtitle">Variable dependiente: {regional.stateValues[0].unit}</p>
          )}
          <StateBarChart values={regional.stateValues} unit={regional.stateValues[0]?.unit} />
          {regional.stateNote && <p className="chart-note">{regional.stateNote}</p>}
        </section>
      ) : null}

      {regional?.map && Object.values(regional.map.valuesByState).some((v) => v != null) ? (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Mapa regional</h2>
          <StateChoropleth map={regional.map} />
        </section>
      ) : regional?.map ? (
        <div className="note" style={{ marginTop: 16 }}>
          <strong>Mapa regional:</strong> {regional.map.title}. {regional.map.note ?? ''}
        </div>
      ) : b.hasMap ? (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Mapa regional</h2>
          <div className="note">Mapa en preparación: se integrará el dato espacial por estado para este indicador.</div>
        </section>
      ) : null}

      <details className="card" style={{ marginTop: 16 }}>
        <summary>
          <h2 style={{ display: 'inline', margin: 0 }}>Fuentes y referencias ({sources.length})</h2>
        </summary>
        <SourceList items={sources} />
      </details>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>¿Qué puede hacer la región?</h2>
        {b.regional.questions && b.regional.questions.length > 0 ? (
          <QuestionList questions={b.regional.questions} />
        ) : (
          <ActionList actions={b.regional.actions} />
        )}
      </section>

      {b.regional.measurementGaps && b.regional.measurementGaps.length > 0 && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>Lo que hay que medir y no se mide</h2>
          <ul className="prose">
            {b.regional.measurementGaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </section>
      )}

      {b.regional.dataGaps && (
        <div className="note" style={{ marginTop: 16 }}>
          <strong>Limitaciones y vacíos de datos:</strong> {b.regional.dataGaps}
        </div>
      )}

      <p className="small muted" style={{ marginTop: 12 }}>
        Ver también: <Link to="/priorizacion">matriz de priorización</Link> · <Link to="/fuentes">catálogo completo de fuentes</Link>
      </p>
    </div>
  )
}
