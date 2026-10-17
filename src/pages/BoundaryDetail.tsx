import { Link, useParams } from 'react-router-dom'
import { catalog, boundaryById, controlVariablesOf, sourceById } from '../data'
import { getRegional } from '../data/regional'
import type { Source } from '../types'
import { StatusBadge, TrendBadge, PriorityBadge } from '../components/StatusBadge'
import TimeSeriesChart from '../components/TimeSeriesChart'
import StateBarChart from '../components/StateBarChart'
import StateChoropleth from '../components/StateChoropleth'
import PriorityEvaluation from '../components/PriorityEvaluation'
import BoundaryArt from '../components/BoundaryArt'
import SpotlightArt from '../components/SpotlightArt'
import { boundaryPriority } from '../lib/priority'
import { ACTOR, SCOPE_LABEL, goTo, groupByActor, shortUrl } from '../lib/editorial'

const boundaries = [...catalog.boundaries].sort((a, b) => a.order - b.order)

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
  const spots = catalog.spotlights.filter((s) => s.relatedBoundaryIds.includes(b.id))
  const related = (b.relatedBoundaryIds ?? []).map((rid) => boundaryById.get(rid)).filter((x): x is NonNullable<typeof x> => Boolean(x))
  const priority = boundaryPriority(b)
  const sources: Source[] = ['phc-main', 'phc-supp']
    .map((sid) => sourceById.get(sid))
    .filter((s): s is Source => Boolean(s))
    .concat(regional?.sources ?? [])
  const idx = boundaries.findIndex((x) => x.id === b.id)
  const prev = boundaries[idx - 1]
  const next = boundaries[idx + 1]

  const hasCharts = Boolean(regional?.charts && regional.charts.length > 0)
  const hasSeries = Boolean(regional?.series && regional.series.length > 0)
  const hasGroups = Boolean(regional?.stateGroups && regional.stateGroups.length > 0)
  const hasStateValues = Boolean(regional?.stateValues && regional.stateValues.some((v) => v.value != null))
  const hasMapData = Boolean(regional?.map && Object.values(regional.map.valuesByState).some((v) => v != null))
  const hasData = hasCharts || hasSeries || hasGroups || hasStateValues || hasMapData || Boolean(regional?.map) || b.hasMap
  const gaps = b.regional.measurementGaps ?? []
  const questions = b.regional.questions ?? []
  const byActor = groupByActor(b.regional.actions)

  const toc = [
    { id: 'idea', label: 'La idea en breve' },
    { id: 'variables', label: 'Variables de control' },
    b.mechanism && { id: 'mecanismo', label: b.mechanism.title },
    { id: 'region', label: 'Qué pasa en el Mar de Cortés' },
    hasData && { id: 'datos', label: 'Los datos' },
    b.regional.scores && { id: 'evaluacion', label: 'Evaluación para la priorización' },
    { id: 'accion', label: '¿Qué puede hacer la región?' },
    (gaps.length > 0 || b.regional.dataGaps) && { id: 'vacios', label: 'Lo que no se mide' },
    (related.length > 0 || spots.length > 0) && { id: 'relacionados', label: 'Temas relacionados' },
    { id: 'fuentes', label: 'Fuentes' },
  ].filter((t): t is { id: string; label: string } => Boolean(t))

  return (
    <>
      <section className="spot-hero">
        <BoundaryArt id={b.id} className="spot-hero-art" />
        <div className="container spot-hero-inner">
          <nav className="breadcrumb on-dark" aria-label="Ruta">
            <Link to="/limites">Límites planetarios</Link> › Límite {b.order} de 9
          </nav>
          <p className="eyebrow">Límite {b.order} · {b.nameEn}</p>
          <h1>{b.name}</h1>
          <p className="lead">{b.question}</p>
          <div className="tag-row">
            <StatusBadge status={b.status} />
            <TrendBadge trend={b.trend} />
            <PriorityBadge priority={priority} />
          </div>
        </div>
      </section>

      <div className="container">
        {b.figures && b.figures.length > 0 && (
          <dl className="facts spot-figs">
            {b.figures.map((f) => (
              <div key={f.label}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
                <dd className={`fig-scope ${f.scope ?? 'regional'}`}>{SCOPE_LABEL[f.scope ?? 'regional']}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="detail-layout section">
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
            <section className="card" id="idea">
              <p className="kicker">La idea en breve</p>
              <p className="spot-message">{b.message}</p>
              <h3 style={{ marginTop: 18 }}>Qué dice el Planetary Health Check 2026</h3>
              <p className="prose" style={{ margin: 0 }}>{b.globalStatus}</p>
            </section>

            <section className="card" id="variables">
              <h2>Variables de control (global)</h2>
              <p className="chart-subtitle">
                Cada límite se mide con una o más variables de control. El valor actual se compara con el límite seguro y con
                el umbral de alto riesgo.
              </p>
              <div className="cv-grid">
                {cvs.map((cv) => (
                  <div key={cv.id} className={`cv-card ${cv.status}`}>
                    <p className="cv-name">{cv.name}</p>
                    <p className="cv-now">{cv.globalValue}</p>
                    <dl className="cv-lims">
                      {cv.safeBoundary && (
                        <div><dt>Límite seguro</dt><dd>{cv.safeBoundary}</dd></div>
                      )}
                      {cv.highRisk && (
                        <div><dt>Alto riesgo</dt><dd>{cv.highRisk}</dd></div>
                      )}
                    </dl>
                    <StatusBadge status={cv.status} />
                    {cv.note && <p className="small muted" style={{ margin: '8px 0 0' }}>{cv.note}</p>}
                  </div>
                ))}
              </div>
            </section>

            {b.mechanism && (
              <section className="card" id="mecanismo">
                <h2>{b.mechanism.title}</h2>
                {b.mechanism.intro && <p className="chart-subtitle">{b.mechanism.intro}</p>}
                <ol className="mech">
                  {b.mechanism.steps.map((st, i) => (
                    <li key={i} className={`mech-step ${st.tone ?? 'neutral'}`}>
                      <span className="mech-n">{i + 1}</span>
                      <h3>{st.title}</h3>
                      <p>{st.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="card" id="region">
              <h2>Qué pasa en el Mar de Cortés</h2>
              <p className="prose region-text">{b.regional.summary}</p>
            </section>

            {hasData && (
              <div className="data-block" id="datos">
                <p className="kicker data-kicker">Los datos</p>
                <div className="stack">
                  {hasCharts &&
                    regional!.charts!.map((c) => (
                      <section className="card" key={c.title}>
                        <h2>{c.title}</h2>
                        {c.subtitle && <p className="chart-subtitle">{c.subtitle}</p>}
                        <TimeSeriesChart series={c.series} />
                        {c.note && <p className="chart-note">{c.note}</p>}
                      </section>
                    ))}

                  {hasSeries && (
                    <section className="card">
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
                </div>
              </div>
            )}

            {b.regional.scores && (
              <section className="card" id="evaluacion">
                <h2>Evaluación para la priorización</h2>
                <PriorityEvaluation regional={b.regional} />
              </section>
            )}

            <section className="card" id="accion">
              <h2>¿Qué puede hacer la región?</h2>
              {questions.length > 0 && (
                <ol className="q-grid">
                  {questions.map((q, i) => (
                    <li className="q-card" key={i}>
                      <span className="mech-n">{i + 1}</span>
                      <h3>{q.q}</h3>
                      <p>{q.action}</p>
                      {q.ref && <p className="q-ref">{q.ref}</p>}
                    </li>
                  ))}
                </ol>
              )}
              {byActor.length > 0 && (
                <>
                  <h3 style={{ marginTop: questions.length > 0 ? 22 : 0 }}>Quién puede actuar</h3>
                  <div className="actor-grid">
                    {byActor.map((g) => (
                      <div className={`actor-col ${ACTOR[g.actor].cls}`} key={g.actor}>
                        <p className={`action-actor ${ACTOR[g.actor].cls}`}>{ACTOR[g.actor].label}</p>
                        <ul>
                          {g.items.map((a, i) => <li key={i}>{a.text}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {(gaps.length > 0 || b.regional.dataGaps) && (
              <section className="card" id="vacios">
                <h2>Lo que hay que medir y no se mide</h2>
                {gaps.length > 0 && (
                  <ul className="prose gap-list">
                    {gaps.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                )}
                {b.regional.dataGaps && (
                  <p className="small muted" style={{ margin: '8px 0 0' }}>
                    <strong>Limitaciones de los datos:</strong> {b.regional.dataGaps}
                  </p>
                )}
              </section>
            )}

            {(related.length > 0 || spots.length > 0) && (
              <section className="card" id="relacionados">
                <h2>Temas relacionados</h2>
                {related.length > 0 && (
                  <>
                    <p className="chart-subtitle">Límites que comparten causas o soluciones con este:</p>
                    <div className="related-grid">
                      {related.map((r) => (
                        <Link to={`/limites/${r.id}`} className="related-card" key={r.id}>
                          <span className="order">Límite {r.order}</span>
                          <strong>{r.name}</strong>
                          <span className="tag-row" style={{ margin: 0 }}>
                            <StatusBadge status={r.status} />
                            <PriorityBadge priority={boundaryPriority(r)} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
                {spots.length > 0 && (
                  <>
                    <p className="chart-subtitle" style={{ marginTop: related.length > 0 ? 18 : 0 }}>
                      Temas emergentes del Planetary Health Check 2026 que involucran este límite:
                    </p>
                    <div className="related-grid">
                      {spots.map((s) => (
                        <Link to={`/spotlights/${s.id}`} className="related-card related-spot" key={s.id}>
                          <SpotlightArt motif={s.motif} className="related-thumb" />
                          <span className="order">Tema emergente {s.order}</span>
                          <strong>{s.short}</strong>
                          <span className="tag-row" style={{ margin: 0 }}>
                            <PriorityBadge priority={boundaryPriority(s)} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            <section className="card" id="fuentes">
              <h2>Fuentes ({sources.length})</h2>
              <ol className="ref-list">
                {sources.map((s) => (
                  <li key={s.id}>
                    <strong>{s.title}</strong>. {s.organization}. Consultado: {s.accessDate}.
                    {s.license ? ` ${s.license}.` : ''}{' '}
                    <a href={s.url} target="_blank" rel="noopener noreferrer">{shortUrl(s.url)}</a>
                    {s.note && <span className="muted"> {s.note}</span>}
                  </li>
                ))}
              </ol>
              <p className="small muted" style={{ margin: '12px 0 0' }}>
                Ver también la <Link to="/priorizacion">matriz de priorización</Link> y el{' '}
                <Link to="/fuentes">catálogo completo de fuentes</Link>.
              </p>
            </section>

            <nav className="spot-pager" aria-label="Otros límites planetarios">
              {prev ? (
                <Link to={`/limites/${prev.id}`} className="pager-link">
                  <span>← Límite {prev.order}</span>
                  <strong>{prev.name}</strong>
                </Link>
              ) : <span />}
              {next ? (
                <Link to={`/limites/${next.id}`} className="pager-link next">
                  <span>Límite {next.order} →</span>
                  <strong>{next.name}</strong>
                </Link>
              ) : (
                <Link to="/limites" className="pager-link next">
                  <span>Volver</span>
                  <strong>Los nueve límites</strong>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
