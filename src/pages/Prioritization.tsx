import { Link } from 'react-router-dom'
import { catalog, sourceById } from '../data'
import type { Reference } from '../types'
import { ReferenceList } from '../lib/cite'
import type { Priority } from '../types'
import PriorityMatrix from '../components/PriorityMatrix'
import BoundaryArt from '../components/BoundaryArt'
import SpotlightArt from '../components/SpotlightArt'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import { assess, compareByPriority, CRITERIA, IMPACT_CRITERIA, LEVERAGE_CRITERIA, type Assessment } from '../lib/priority'
import { goTo } from '../lib/editorial'

const fmt = (n: number) => n.toFixed(2)

const methodRefs = ['cmp-2020', 'salafsky-2008', 'hayha-2016', 'huang-2011', 'oecd-jrc-2008']
  .map((id) => sourceById.get(id))
  .filter((r): r is Reference => Boolean(r))

const rows = [...catalog.boundaries]
  .sort((a, b) => compareByPriority(a, b) || a.order - b.order)
  .map((b) => ({ b, a: assess(b)! }))

const spots = [...catalog.spotlights]
  .sort((a, b) => compareByPriority(a, b) || a.order - b.order)
  .map((s) => ({ s, a: assess(s)! }))

const GROUPS: { p: Priority; title: string; text: string }[] = [
  {
    p: 'Alta',
    title: 'Prioridad alta',
    text: 'Impacto alto y apalancamiento alto: la región sufre el problema y tiene en sus manos las causas y las soluciones. Aquí conviene concentrar recursos.',
  },
  {
    p: 'Media',
    title: 'Prioridad media',
    text: 'Un eje es alto o medio y el otro medio. Hay que actuar, pero el esfuerzo rinde menos o el daño está más acotado.',
  },
  {
    p: 'Baja',
    title: 'Prioridad baja',
    text: 'Impacto bajo o apalancamiento bajo. No significa que no importe: la respuesta regional es sobre todo monitorear y adaptarse.',
  },
]

const STEPS = [
  { title: 'Calificar seis criterios', text: 'Tres de impacto y tres de apalancamiento, cada uno de 1 a 4 según una definición explícita.' },
  { title: 'Calcular cada eje', text: 'Impacto y apalancamiento son la media geométrica de sus tres criterios: un criterio bajo no se compensa.' },
  { title: 'Asignar el nivel', text: 'Alto con 3.0 o más, medio de 2.0 a menos de 3.0 y bajo con menos de 2.0.' },
  { title: 'Clasificar la prioridad', text: 'Alta solo si ambos ejes son altos; baja si alguno es bajo; media en el resto.' },
  { title: 'Probar la sensibilidad', text: 'Se mueve cada criterio un punto arriba y abajo para ver si la prioridad cambia.' },
]

/** Barra horizontal de 1 a 4 con el umbral alto marcado */
function AxisBar({ label, value, level }: { label: string; value: number; level: string }) {
  const pct = ((value - 1) / 3) * 100
  return (
    <div className="axis-bar">
      <span className="axis-label">{label}</span>
      <span className="axis-track" aria-hidden="true">
        <span className={`axis-fill ${level.toLowerCase()}`} style={{ width: `${pct}%` }} />
        <span className="axis-tick" style={{ left: `${(2 / 3) * 100}%` }} />
      </span>
      <span className="axis-val num">{fmt(value)} <span className="muted">{level.toLowerCase()}</span></span>
    </div>
  )
}

function Robustness({ a }: { a: Assessment }) {
  return a.robust ? (
    <p className="prio-note">Clasificación robusta: ningún cambio de un punto la modifica.</p>
  ) : (
    <p className="prio-note sensitive">Sensible: {a.sensitiveTo.join('; ')}.</p>
  )
}

export default function Prioritization() {
  const toc = [
    { id: 'idea', label: 'La idea en breve' },
    { id: 'matriz', label: 'La matriz' },
    { id: 'resultados', label: 'Resultados por límite' },
    { id: 'tabla', label: 'Tabla de calificaciones' },
    { id: 'metodo', label: 'Cómo se calcula' },
    { id: 'criterios', label: 'Los seis criterios' },
    { id: 'temas', label: 'Temas emergentes' },
    { id: 'limitaciones', label: 'Limitaciones' },
    { id: 'referencias', label: 'Referencias' },
  ]

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Priorización regional · Mar de Cortés</p>
          <h1>Dónde puede actuar la región</h1>
          <p className="lead">
            No todos los límites planetarios merecen el mismo esfuerzo desde el Mar de Cortés. Priorizamos donde la región
            sufre un impacto alto y, al mismo tiempo, tiene en sus manos las causas y las soluciones.
          </p>
        </div>
      </section>

      <div className="container">
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
              <p className="spot-message">
                Un límite merece prioridad regional cuando se cumplen dos condiciones a la vez: el daño en la región es alto y
                la región puede hacer algo eficaz para reducirlo. Si falta una de las dos, el esfuerzo rinde menos.
              </p>
              <div className="prio-axes">
                <div className="prio-axis impact">
                  <h3>Impacto regional</h3>
                  <p>¿Cuánto daño causa en el Mar de Cortés?</p>
                  <ul>
                    {IMPACT_CRITERIA.map((c) => <li key={c.id}><strong>{c.name}.</strong> {c.question}</li>)}
                  </ul>
                </div>
                <div className="prio-axis leverage">
                  <h3>Apalancamiento regional</h3>
                  <p>¿Cuánto puede hacer la región para corregirlo?</p>
                  <ul>
                    {LEVERAGE_CRITERIA.map((c) => <li key={c.id}><strong>{c.name}.</strong> {c.question}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="card" id="matriz">
              <h2>Matriz impacto × apalancamiento</h2>
              <p className="chart-subtitle">
                Cada punto es un límite planetario, ubicado por su impacto (eje vertical) y su apalancamiento (eje
                horizontal), ambos de 1 a 4. Las líneas punteadas marcan los umbrales de 2 (nivel medio) y 3 (nivel alto); la
                zona sombreada es la de prioridad alta.
              </p>
              <PriorityMatrix height={460} />
            </section>

            <div id="resultados">
              {GROUPS.map((g) => {
                const items = rows.filter((r) => r.a.priority === g.p)
                if (items.length === 0) return null
                return (
                  <section className={`card prio-group p-${g.p.toLowerCase()}`} key={g.p}>
                    <div className="prio-group-head">
                      <h2>{g.title} <span className="bnd-count">{items.length}</span></h2>
                      <p className="muted">{g.text}</p>
                    </div>
                    <div className="prio-list">
                      {items.map(({ b, a }) => (
                        <article className="prio-card" key={b.id}>
                          <Link to={`/limites/${b.id}`} className="prio-thumb" tabIndex={-1} aria-hidden="true">
                            <BoundaryArt id={b.id} />
                            <span className="spot-num">{b.order}</span>
                          </Link>
                          <div className="prio-body">
                            <h3><Link to={`/limites/${b.id}`}>{b.name}</Link></h3>
                            <div className="tag-row"><StatusBadge status={b.status} /></div>
                            <AxisBar label="Impacto" value={a.impact} level={a.impactLevel} />
                            <AxisBar label="Apalancamiento" value={a.leverage} level={a.leverageLevel} />
                            <Robustness a={a} />
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>

            <section className="card" id="tabla">
              <h2>Tabla de calificaciones</h2>
              <p className="chart-subtitle">
                Calificación de cada criterio (1 a 4). La justificación de cada número está en la página de cada límite, en la
                sección «Evaluación para la priorización».
              </p>
              <div className="table-scroll">
                <table className="ptable compact">
                  <thead>
                    <tr>
                      <th>Límite planetario</th>
                      {IMPACT_CRITERIA.map((c) => <th key={c.id} title={c.question}>{c.id === 'irreversibilidad' ? 'Irrevers.' : c.name}</th>)}
                      <th>Impacto</th>
                      {LEVERAGE_CRITERIA.map((c) => <th key={c.id} title={c.question}>{c.id === 'factibilidad' ? 'Factib.' : c.id === 'competencia' ? 'Compet.' : 'Control'}</th>)}
                      <th>Apalanc.</th>
                      <th>Prioridad</th>
                      <th>Robustez</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ b, a }) => (
                      <tr key={b.id}>
                        <td><Link to={`/limites/${b.id}`}>{b.name}</Link></td>
                        {IMPACT_CRITERIA.map((c) => <td key={c.id} className="num">{b.regional.scores![c.id].value}</td>)}
                        <td className="num"><strong>{fmt(a.impact)}</strong><br /><span className="small muted">{a.impactLevel}</span></td>
                        {LEVERAGE_CRITERIA.map((c) => <td key={c.id} className="num">{b.regional.scores![c.id].value}</td>)}
                        <td className="num"><strong>{fmt(a.leverage)}</strong><br /><span className="small muted">{a.leverageLevel}</span></td>
                        <td><PriorityBadge priority={a.priority} /></td>
                        <td className="small">{a.robust ? 'Robusta' : <strong>Sensible</strong>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card" id="metodo">
              <h2>Cómo se calcula</h2>
              <p className="chart-subtitle">
                El método adapta dos marcos establecidos. Para el <strong>impacto</strong> usa los tres criterios con que los
                Estándares Abiertos para la Práctica de la Conservación califican una amenaza: alcance, severidad e
                irreversibilidad. Para el <strong>apalancamiento</strong> parte de la distinción de Häyhä et al. (2016) entre los
                límites que dependen de un presupuesto global (clima, ozono) y los que dependen de condiciones locales
                (biodiversidad, agua, suelo, nutrientes), y la combina con la competencia de los actores y la factibilidad de las
                soluciones.
              </p>
              <ol className="mech">
                {STEPS.map((st, i) => (
                  <li key={i} className={`mech-step ${i === 3 ? 'gain' : 'neutral'}`}>
                    <span className="mech-n">{i + 1}</span>
                    <h3>{st.title}</h3>
                    <p>{st.text}</p>
                  </li>
                ))}
              </ol>

              <div className="prose method-detail">
                <h3>Paso 2. Calcular cada eje con la media geométrica</h3>
                <p className="formula">
                  <strong>Impacto</strong> = ∛(alcance × severidad × irreversibilidad)
                  <br />
                  <strong>Apalancamiento</strong> = ∛(control × competencia × factibilidad)
                </p>
                <p>
                  Ambos resultados van de 1 a 4. Se usa la media geométrica, y no la suma, porque un criterio bajo no se
                  compensa con otros altos: un problema grave pero cuyas causas son globales no alcanza un apalancamiento alto
                  solo porque existan algunas soluciones locales. El manual de la OCDE y el JRC sobre indicadores compuestos
                  describe esta agregación como menos compensatoria que la suma, adecuada cuando no se quiere que un componente
                  bajo se oculte.
                </p>
                <p className="example">
                  <strong>Ejemplo.</strong> El cambio climático tiene control 1, competencia 3 y factibilidad 3. Su
                  apalancamiento es ∛(1 × 3 × 3) = ∛9 = 2.08 (nivel medio). Con un promedio simple habría salido 2.33: la media
                  geométrica castiga más el criterio bajo.
                </p>

                <h3>Pasos 3 y 4. Del nivel a la prioridad</h3>
                <div className="rule-grid">
                  <div className="rule alta"><PriorityBadge priority="Alta" /><p>Impacto alto <em>y</em> apalancamiento alto. Es el único caso en que conviene concentrar recursos regionales.</p></div>
                  <div className="rule media"><PriorityBadge priority="Media" /><p>El resto: al menos un eje medio y ninguno bajo.</p></div>
                  <div className="rule baja"><PriorityBadge priority="Baja" /><p>Impacto bajo <em>o</em> apalancamiento bajo.</p></div>
                </div>
                <p>
                  Dentro de cada clase, los límites se ordenan por el producto impacto × apalancamiento. Una prioridad media o
                  baja no significa que el problema no importe: en el cambio climático, por ejemplo, el impacto es el más alto
                  posible, pero la región no controla sus causas, así que su respuesta debe centrarse en la adaptación.
                </p>

                <h3>Paso 5. Probar la sensibilidad</h3>
                <p>
                  Para cada límite se cambia un criterio a la vez un punto hacia arriba y hacia abajo. Si ningún cambio modifica
                  la prioridad, la clasificación es <strong>robusta</strong>; si alguno la modifica, es <strong>sensible</strong>.
                  Las clasificaciones sensibles son las que más conviene revisar cuando aparezca nueva evidencia.
                </p>
              </div>
            </section>

            <section className="card" id="criterios">
              <h2>Los seis criterios</h2>
              <p className="chart-subtitle">Cada criterio se califica con la evidencia verificada del límite, según estas definiciones.</p>
              <div className="table-scroll">
                <table className="ptable">
                  <thead>
                    <tr><th>Eje</th><th>Criterio</th><th>4</th><th>3</th><th>2</th><th>1</th></tr>
                  </thead>
                  <tbody>
                    {CRITERIA.map((c) => (
                      <tr key={c.id}>
                        <td className="small">{c.axis === 'impact' ? 'Impacto' : 'Apalancamiento'}</td>
                        <td><strong>{c.name}</strong><br /><span className="small muted">{c.question}</span></td>
                        {([4, 3, 2, 1] as const).map((v) => <td key={v} className="small">{c.levels[v]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card" id="temas">
              <h2>Los temas emergentes, con el mismo método</h2>
              <p className="chart-subtitle">
                Los tres riesgos que el Planetary Health Check 2026 trata aparte también se califican con los seis criterios,
                para poder compararlos con los nueve límites. No aparecen en la matriz porque no son límites.
              </p>
              <div className="prio-list">
                {spots.map(({ s, a }) => (
                  <article className="prio-card" key={s.id}>
                    <Link to={`/spotlights/${s.id}`} className="prio-thumb" tabIndex={-1} aria-hidden="true">
                      <SpotlightArt motif={s.motif} />
                    </Link>
                    <div className="prio-body">
                      <h3><Link to={`/spotlights/${s.id}`}>{s.short}</Link></h3>
                      <div className="tag-row"><PriorityBadge priority={a.priority} /></div>
                      <AxisBar label="Impacto" value={a.impact} level={a.impactLevel} />
                      <AxisBar label="Apalancamiento" value={a.leverage} level={a.leverageLevel} />
                      <Robustness a={a} />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="card" id="limitaciones">
              <h2>Limitaciones</h2>
              <ul className="prose gap-list">
                <li>Las calificaciones son un juicio experto basado en la evidencia de cada límite; no son mediciones.</li>
                <li>La evidencia regional es desigual entre estados y entre límites, y en varios casos es histórica.</li>
                <li>Los tres criterios de cada eje pesan lo mismo.</li>
                <li>El método se revisará cuando cambie la evidencia o cuando se valide con los equipos de las universidades y los actores regionales.</li>
              </ul>
            </section>

            <section className="card" id="referencias">
              <h2>Referencias</h2>
              <ReferenceList refs={methodRefs} prefix="ref" />
            </section>

            <nav className="spot-pager" aria-label="Continuar la lectura">
              <Link to="/limites" className="pager-link">
                <span>← Anterior</span>
                <strong>Límites planetarios</strong>
              </Link>
              <Link to="/spotlights" className="pager-link next">
                <span>Siguiente →</span>
                <strong>Temas emergentes</strong>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
