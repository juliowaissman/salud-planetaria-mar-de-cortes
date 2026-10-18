import { Link, useParams } from 'react-router-dom'
import { catalog, boundaryById, spotlightById } from '../data'
import type { Spotlight } from '../types'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import SpotlightArt from '../components/SpotlightArt'
import SpotlightChartView from '../components/SpotlightChartView'
import PriorityEvaluation from '../components/PriorityEvaluation'
import { assess, boundaryPriority } from '../lib/priority'
import { ACTOR, goTo, groupByActor, reportUrl } from '../lib/editorial'
import { Cites as CiteList, ReferenceList } from '../lib/cite'

const spotlights = [...catalog.spotlights].sort((a, b) => a.order - b.order)

/** Citas autor-año que llevan a la lista de referencias del tema */
function Cites({ ids, refs }: { ids?: string[]; refs: Spotlight['references'] }) {
  return <CiteList ids={ids} refs={refs} prefix="ref" />
}

/* =========================================================
   Índice de temas emergentes
   ========================================================= */
function SpotlightIndex() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Temas emergentes · Planetary Health Check 2026</p>
          <h1>Riesgos que cruzan varios límites</h1>
          <p className="lead">
            Además de evaluar los nueve límites planetarios, el Planetary Health Check 2026 dedica tres capítulos a riesgos
            que la ciencia apenas empieza a medir. Aquí se leen desde el Mar de Cortés: qué dice el informe, qué pasa en la
            región y qué se puede hacer.
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="spot-intro">
          <div className="prose">
            <p className="kicker">Por qué importan</p>
            <h2>No son límites nuevos, sino advertencias</h2>
            <p>
              Los temas emergentes no agregan variables de control al marco de los límites planetarios. Señalan procesos
              que conectan varios límites a la vez y que pueden debilitar la capacidad del planeta para amortiguar la
              presión humana: la tierra que absorbe cada vez menos carbono, el fondo marino que se raspa sin que lo
              veamos y las sustancias sintéticas cuyos efectos desconocemos.
            </p>
            <p>
              Los tres se califican con el mismo <Link to="/priorizacion">método de priorización</Link> que los nueve
              límites, para que sea posible compararlos.
            </p>
          </div>
          <div className="table-scroll">
            <table className="ptable spot-summary">
              <thead>
                <tr><th>Tema</th><th>Impacto</th><th>Apalanc.</th><th>Prioridad</th></tr>
              </thead>
              <tbody>
                {spotlights.map((s) => {
                  const a = assess(s)
                  return (
                    <tr key={s.id}>
                      <td><Link to={`/spotlights/${s.id}`}>{s.short}</Link></td>
                      <td className="num">{a ? a.impact.toFixed(2) : '—'}<br /><span className="small muted">{a?.impactLevel}</span></td>
                      <td className="num">{a ? a.leverage.toFixed(2) : '—'}<br /><span className="small muted">{a?.leverageLevel}</span></td>
                      <td><PriorityBadge priority={boundaryPriority(s)} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="spot-list">
          {spotlights.map((s) => (
            <article className="spot-feature" key={s.id}>
              <Link to={`/spotlights/${s.id}`} className="spot-feature-art" tabIndex={-1} aria-hidden="true">
                <SpotlightArt motif={s.motif} />
                <span className="spot-num">0{s.order}</span>
              </Link>
              <div className="spot-feature-body">
                <div className="tag-row">
                  <PriorityBadge priority={boundaryPriority(s)} />
                  <span className="badge not-quantified">{s.chapter.split('·')[0].trim()}</span>
                </div>
                <h2><Link to={`/spotlights/${s.id}`}>{s.name}</Link></h2>
                <p className="spot-question">{s.question}</p>
                <p className="muted">{s.summary}</p>
                <div className="spot-mini-figs">
                  {s.figures.slice(0, 2).map((f) => (
                    <div key={f.label}>
                      <strong>{f.value}</strong>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
                <p className="small muted" style={{ margin: '0 0 12px' }}>
                  Límites relacionados:{' '}
                  {s.relatedBoundaryIds.map((bid, i) => (
                    <span key={bid}>
                      {i > 0 && ' · '}
                      <Link to={`/limites/${bid}`}>{boundaryById.get(bid)?.name ?? bid}</Link>
                    </span>
                  ))}
                </p>
                <Link to={`/spotlights/${s.id}`} className="btn btn-outline">Leer el tema completo →</Link>
              </div>
            </article>
          ))}
        </div>

        <p className="small muted" style={{ marginTop: 28 }}>
          Fuente global: Caesar et al. (2026), <em>Planetary Health Check 2026</em>, capítulo 4 «Spotlights»,
          Potsdam Institute for Climate Impact Research. Las lecturas regionales y las calificaciones son del
          Observatorio Tecnológico del Mar de Cortés.
        </p>
      </div>
    </>
  )
}

/* =========================================================
   Página de un tema emergente
   ========================================================= */
function SpotlightDetail({ s }: { s: Spotlight }) {
  const priority = boundaryPriority(s)
  const related = s.relatedBoundaryIds.map((bid) => boundaryById.get(bid)).filter((b): b is NonNullable<typeof b> => Boolean(b))
  const idx = spotlights.findIndex((x) => x.id === s.id)
  const prev = spotlights[idx - 1]
  const next = spotlights[idx + 1]
  const hasKinds = s.findings.some((f) => f.kind)
  const gaps = s.regional.measurementGaps ?? []

  const toc = [
    { id: 'idea', label: 'La idea en breve' },
    { id: 'mecanismo', label: s.mechanism.title },
    { id: 'region', label: 'Qué pasa en el Mar de Cortés' },
    s.chart && { id: 'datos', label: 'Los datos' },
    s.regional.scores && { id: 'evaluacion', label: 'Evaluación para la priorización' },
    { id: 'accion', label: '¿Qué puede hacer la región?' },
    gaps.length > 0 && { id: 'vacios', label: 'Lo que no sabemos' },
    { id: 'relacionados', label: 'Límites relacionados' },
    { id: 'referencias', label: 'Referencias' },
  ].filter((t): t is { id: string; label: string } => Boolean(t))

  const byActor = groupByActor(s.regional.actions)

  const findingCard = (f: Spotlight['findings'][number], i: number) => (
    <div className={`finding ${f.kind ?? ''}`} key={i}>
      {f.where && <p className="finding-where">{f.where}</p>}
      <h3>{f.title}</h3>
      <p>
        {f.text}
        <Cites ids={f.refIds} refs={s.references} />
      </p>
    </div>
  )

  return (
    <>
      <section className={`spot-hero motif-${s.motif}`}>
        <SpotlightArt motif={s.motif} className="spot-hero-art" />
        <div className="container spot-hero-inner">
          <nav className="breadcrumb on-dark" aria-label="Ruta">
            <Link to="/spotlights">Temas emergentes</Link> › Tema {s.order} de {spotlights.length}
          </nav>
          <p className="eyebrow">{s.chapter}</p>
          <h1>{s.name}</h1>
          <p className="lead">{s.question}</p>
          <div className="tag-row">
            <PriorityBadge priority={priority} />
            <span className="badge on-dark">{s.nameEn}</span>
          </div>
          <p className="hero-actions">
            <a className="btn btn-ghost btn-sm" href={reportUrl(s.id)} download>
              Descargar en PDF
            </a>
          </p>
        </div>
      </section>

      <div className="container">
        <dl className="facts spot-figs">
          {s.figures.map((f) => (
            <div key={f.label}>
              <dt>{f.value}</dt>
              <dd>
                {f.label}
                <Cites ids={f.refId ? [f.refId] : undefined} refs={s.references} />
              </dd>
            </div>
          ))}
        </dl>

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
              <p className="spot-message">{s.message}</p>
              <h3 style={{ marginTop: 18 }}>Qué dice el Planetary Health Check 2026</h3>
              <ul className="prose spot-points">
                {s.phc.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              {s.phc.quote && <blockquote className="spot-quote">{s.phc.quote}</blockquote>}
            </section>

            <section className="card" id="mecanismo">
              <h2>{s.mechanism.title}</h2>
              {s.mechanism.intro && <p className="chart-subtitle">{s.mechanism.intro}</p>}
              <ol className="mech">
                {s.mechanism.steps.map((st, i) => (
                  <li key={i} className={`mech-step ${st.tone ?? 'neutral'}`}>
                    <span className="mech-n">{i + 1}</span>
                    <h3>{st.title}</h3>
                    <p>{st.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="card" id="region">
              <h2>Qué pasa en el Mar de Cortés</h2>
              <p className="prose" style={{ marginBottom: 14 }}>{s.regional.summary}</p>
              {hasKinds ? (
                <div className="finding-cols">
                  <div>
                    <p className="finding-col-title known">Lo que sabemos: impactos documentados</p>
                    <div className="finding-grid one">{s.findings.filter((f) => f.kind === 'conocido').map(findingCard)}</div>
                  </div>
                  <div>
                    <p className="finding-col-title unknown">Lo que no sabemos: amenazas sin medir</p>
                    <div className="finding-grid one">{s.findings.filter((f) => f.kind !== 'conocido').map(findingCard)}</div>
                  </div>
                </div>
              ) : (
                <div className="finding-grid">{s.findings.map(findingCard)}</div>
              )}
            </section>

            {s.chart && (
              <section className="card" id="datos">
                <h2>{s.chart.title}</h2>
                {s.chart.subtitle && <p className="chart-subtitle">{s.chart.subtitle}</p>}
                <SpotlightChartView chart={s.chart} height={s.chart.type === 'hbar' ? Math.max(260, s.chart.categories.length * 44) : 320} />
                {s.chart.note && (
                  <p className="chart-note">
                    {s.chart.note}
                    <Cites ids={s.chart.refId ? [s.chart.refId] : undefined} refs={s.references} />
                  </p>
                )}
              </section>
            )}

            {s.regional.scores && (
              <section className="card" id="evaluacion">
                <h2>Evaluación para la priorización</h2>
                <PriorityEvaluation regional={s.regional} />
              </section>
            )}

            <section className="card" id="accion">
              <h2>¿Qué puede hacer la región?</h2>
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
            </section>

            {gaps.length > 0 && (
              <section className="card" id="vacios">
                <h2>Lo que no sabemos (y habría que medir)</h2>
                <ul className="prose gap-list">
                  {gaps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
                {s.regional.dataGaps && <p className="small muted" style={{ margin: '8px 0 0' }}>{s.regional.dataGaps}</p>}
              </section>
            )}

            <section className="card" id="relacionados">
              <h2>Límites relacionados</h2>
              <div className="related-grid">
                {related.map((b) => (
                  <Link to={`/limites/${b.id}`} className="related-card" key={b.id}>
                    <span className="order">Límite {b.order}</span>
                    <strong>{b.name}</strong>
                    <span className="tag-row" style={{ margin: 0 }}>
                      <StatusBadge status={b.status} />
                      <PriorityBadge priority={boundaryPriority(b)} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="card" id="referencias">
              <h2>Referencias</h2>
              <ReferenceList refs={s.references} prefix="ref" />
            </section>

            <nav className="spot-pager" aria-label="Otros temas emergentes">
              {prev ? (
                <Link to={`/spotlights/${prev.id}`} className="pager-link">
                  <span>← Tema anterior</span>
                  <strong>{prev.short}</strong>
                </Link>
              ) : <span />}
              {next ? (
                <Link to={`/spotlights/${next.id}`} className="pager-link next">
                  <span>Tema siguiente →</span>
                  <strong>{next.short}</strong>
                </Link>
              ) : (
                <Link to="/spotlights" className="pager-link next">
                  <span>Volver</span>
                  <strong>Todos los temas emergentes</strong>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Spotlights() {
  const { id } = useParams()
  if (!id) return <SpotlightIndex />
  const s = spotlightById.get(id)
  if (!s) {
    return (
      <div className="container section">
        <p>Tema no encontrado. <Link to="/spotlights">Volver a los temas emergentes</Link>.</p>
      </div>
    )
  }
  return <SpotlightDetail s={s} />
}
