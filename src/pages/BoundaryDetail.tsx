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

  const hasCharts = Boolean(regional?.charts && regional.charts.length > 0)
  const hasSeries = Boolean(regional?.series && regional.series.length > 0)
  const hasGroups = Boolean(regional?.stateGroups && regional.stateGroups.length > 0)
  const hasStateValues = Boolean(regional?.stateValues && regional.stateValues.some((v) => v.value != null))
  const hasMapData = Boolean(regional?.map && Object.values(regional.map.valuesByState).some((v) => v != null))
  const hasGaps = Boolean(b.regional.measurementGaps && b.regional.measurementGaps.length > 0)

  const toc = [
    { id: 'diagnostico', label: 'Diagnóstico regional' },
    { id: 'variables', label: 'Variables de control' },
    (hasCharts || hasSeries) && { id: 'graficas', label: 'Gráficas regionales' },
    (hasGroups || hasStateValues) && { id: 'estados', label: 'Comparación por estado' },
    (hasMapData || b.hasMap) && { id: 'mapa', label: 'Mapa regional' },
    { id: 'fuentes', label: 'Fuentes y referencias' },
    { id: 'accion', label: '¿Qué puede hacer la región?' },
    hasGaps && { id: 'brechas', label: 'Lo que no se mide' },
  ].filter((t): t is { id: string; label: string } => Boolean(t))

  // El sitio usa HashRouter: se desplaza con JS en lugar de anclas #id
  const goTo = (sid: string) => {
    const el = document.getElementById(sid)
    if (!el) return
    if (el instanceof HTMLDetailsElement) el.open = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Ruta">
        <Link to="/limites">Límites planetarios</Link> › {b.name}
      </nav>

      <div className="tag-row">
        <StatusBadge status={b.status} />
        <TrendBadge trend={b.trend} />
        <PriorityBadge priority={priority} />
      </div>
      <h1>{b.name}</h1>
      <p className="muted">{b.nameEn} · Límite {b.order} de 9</p>
      <div className="note" style={{ marginBottom: 24 }}>{b.globalStatus}</div>

      <div className="detail-layout">
        <nav className="toc" aria-label="En esta página">
          <p className="toc-title">En esta página</p>
          <ul>
            {toc.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => goTo(t.id)}>{t.label}</button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="stack">
          <section className="card" id="diagnostico">
            <h2>Diagnóstico regional (Mar de Cortés)</h2>
            <p className="prose">{b.regional.summary}</p>
            <div className="grid cols-3" style={{ marginTop: 8 }}>
              <div className="metric">
                <span className="label">Impacto regional</span>
                <span className="badge info">{b.regional.impact}</span>
              </div>
              <div className="metric">
                <span className="label">Apalancamiento regional</span>
                <span className="badge info">{b.regional.leverage}</span>
              </div>
              <div className="metric">
                <span className="label">Prioridad resultante</span>
                <PriorityBadge priority={priority} />
              </div>
            </div>
          </section>

          <section className="card" id="variables">
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
                  {cv.safeBoundary && cv.note && <div className="small muted" style={{ marginTop: 4 }}>{cv.note}</div>}
                </div>
              ))}
            </div>
          </section>

          {hasCharts &&
            regional!.charts!.map((c, i) => (
              <section className="card" key={c.title} id={i === 0 ? 'graficas' : undefined}>
                <h2>{c.title}</h2>
                {c.subtitle && <p className="chart-subtitle">{c.subtitle}</p>}
                <TimeSeriesChart series={c.series} />
                {c.note && <p className="chart-note">{c.note}</p>}
              </section>
            ))}

          {hasSeries && (
            <section className="card" id={hasCharts ? undefined : 'graficas'}>
              <h2>{regional!.seriesTitle ?? 'Series regionales'}</h2>
              {regional!.series![0]?.unit && (
                <p className="chart-subtitle">Variable dependiente: {regional!.series![0].unit}</p>
              )}
              <TimeSeriesChart series={regional!.series!} />
              {regional!.seriesNote && <p className="chart-note">{regional!.seriesNote}</p>}
            </section>
          )}

          {hasGroups ? (
            <section className="card" id="estados">
              <h2>Comparación por estado</h2>
              {regional!.stateGroups!.map((g, i) => (
                <div key={g.id} style={{ marginTop: i === 0 ? 0 : 24 }}>
                  <h3>{g.title}</h3>
                  {g.unit && <p className="chart-subtitle">Variable dependiente: {g.unit}</p>}
                  <StateBarChart values={g.values} unit={g.unit} />
                  {g.note && <p className="chart-note">{g.note}</p>}
                </div>
              ))}
            </section>
          ) : hasStateValues ? (
            <section className="card" id="estados">
              <h2>{regional!.stateTitle ?? 'Comparación por estado'}</h2>
              {regional!.stateValues![0]?.unit && (
                <p className="chart-subtitle">Variable dependiente: {regional!.stateValues![0].unit}</p>
              )}
              <StateBarChart values={regional!.stateValues!} unit={regional!.stateValues![0]?.unit} />
              {regional!.stateNote && <p className="chart-note">{regional!.stateNote}</p>}
            </section>
          ) : null}

          {hasMapData ? (
            <section className="card" id="mapa">
              <h2>Mapa regional</h2>
              <StateChoropleth map={regional!.map!} />
            </section>
          ) : regional?.map ? (
            <div className="note" id="mapa">
              <strong>Mapa regional:</strong> {regional.map.title}. {regional.map.note ?? ''}
            </div>
          ) : b.hasMap ? (
            <section className="card" id="mapa">
              <h2>Mapa regional</h2>
              <div className="note">Mapa en preparación: se integrará el dato espacial por estado para este indicador.</div>
            </section>
          ) : null}

          <details className="card" id="fuentes">
            <summary>
              <h2 style={{ display: 'inline', margin: 0 }}>Fuentes y referencias ({sources.length})</h2>
            </summary>
            <SourceList items={sources} />
          </details>

          <section className="card" id="accion">
            <h2>¿Qué puede hacer la región?</h2>
            {b.regional.questions && b.regional.questions.length > 0 ? (
              <QuestionList questions={b.regional.questions} />
            ) : (
              <ActionList actions={b.regional.actions} />
            )}
          </section>

          {hasGaps && (
            <section className="card" id="brechas">
              <h2>Lo que hay que medir y no se mide</h2>
              <ul className="prose">
                {b.regional.measurementGaps!.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
          )}

          {b.regional.dataGaps && (
            <div className="note">
              <strong>Limitaciones y vacíos de datos:</strong> {b.regional.dataGaps}
            </div>
          )}


          <p className="small muted" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span>
              Ver también: <Link to="/priorizacion">matriz de priorización</Link> ·{' '}
              <Link to="/fuentes">catálogo completo de fuentes</Link>
            </span>
            <button type="button" className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              ↑ Volver arriba
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
