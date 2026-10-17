import { Link } from 'react-router-dom'
import { catalog, sourceById } from '../data'
import type { DirectoryOrg, DirectoryPerson } from '../types'

const base = import.meta.env.BASE_URL

// Universidad (id del directorio) → estado que representa como nodo
const NODE_STATE: Record<string, string> = {
  uabc: 'bc',
  uabcs: 'bcs',
  unison: 'son',
  uas: 'sin',
  uan: 'nay',
}

const orgById = new Map(catalog.directory.map((o) => [o.id, o]))
const corredor = orgById.get('corredor')
const foro = orgById.get('fmc')
const report = sourceById.get('phc-main')
const richardson = sourceById.get('richardson-2023')

// Los nodos se muestran en el orden geográfico de los estados (norte → sur)
const nodes = catalog.states
  .map((s) => {
    const orgId = Object.keys(NODE_STATE).find((k) => NODE_STATE[k] === s.id)
    return { state: s, org: orgId ? orgById.get(orgId) : undefined }
  })
  .filter((n): n is { state: (typeof catalog.states)[number]; org: DirectoryOrg } => Boolean(n.org))

const principles = [
  {
    title: 'Trazable',
    text: 'Cada dato se vincula a una fuente pública con URL y fecha de consulta. No se inventan valores: los vacíos se señalan como vacíos.',
  },
  {
    title: 'Priorizada',
    text: 'No todos los límites pesan igual en la región. Se cruza el impacto regional con la capacidad de incidir para no dispersar recursos.',
  },
  {
    title: 'Accesible',
    text: 'En español, con lenguaje claro para tomadores de decisiones, investigadores y público en general.',
  },
  {
    title: 'Abierta',
    text: 'Sitio estático con datos en archivos versionables que los equipos de investigación pueden revisar y actualizar.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Estado global',
    text: 'El Planetary Health Check 2026 evalúa 13 variables de control en los 9 límites planetarios.',
  },
  {
    n: '02',
    title: 'Lectura regional',
    text: 'Para cada límite se reúnen datos públicos de los cinco estados y se resume qué tan presente está en el Golfo.',
  },
  {
    n: '03',
    title: 'Priorización',
    text: 'Una matriz impacto × apalancamiento señala dónde la región puede hacer más diferencia.',
  },
  {
    n: '04',
    title: 'Agenda de trabajo',
    text: 'Preguntas abiertas y brechas de medición para la triple hélice academia–empresa–gobierno.',
  },
]

function initials(name: string) {
  return name
    .replace(/^(Dr\.|Dra\.|Mtro\.|Mtra\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function Person({ p }: { p: DirectoryPerson }) {
  return (
    <div className="person">
      {p.photo ? (
        <img src={`${base}img/${p.photo}`} alt="" loading="lazy" />
      ) : (
        <span className="avatar" aria-hidden="true">{initials(p.name)}</span>
      )}
      <div>
        <div className="pname">{p.name}</div>
        <div className="prole">{p.role}</div>
      </div>
    </div>
  )
}

function shortName(org: DirectoryOrg) {
  return org.name.match(/\(([^)]+)\)/)?.[1] ?? org.name
}

export default function About() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Acerca</p>
          <h1>Observatorio Tecnológico del Mar de Cortés</h1>
          <p className="lead">
            Ciencia, innovación y sostenibilidad para el Golfo de California, desde las cinco universidades públicas de la
            región y el sector empresarial.
          </p>
        </div>
      </section>

      <div className="container">
        {/* ---------- Quiénes somos ---------- */}
        <section className="section about-intro">
          <div className="prose">
            <p className="kicker">Quiénes somos</p>
            <h2>Una red académica y empresarial para el Golfo</h2>
            <p>
              El <strong>Observatorio Tecnológico del Mar de Cortés</strong> articula ciencia, innovación y sostenibilidad
              para la región del Golfo de California. Es una iniciativa del <strong>Foro Mar de Cortés</strong> y de las
              cinco universidades públicas de los estados que rodean el golfo, reunidas en el{' '}
              <strong>Corredor Científico, Académico y Empresarial del Mar de Cortés</strong>.
            </p>
            <p>
              En su primera fase se enfoca en analizar la incidencia regional de los <strong>límites planetarios</strong>:
              nueve procesos biofísicos que regulan la estabilidad y resiliencia del sistema terrestre, con umbrales que
              definen una zona de operación segura para la humanidad.
            </p>
          </div>
          <dl className="facts">
            <div>
              <dt>5</dt>
              <dd>universidades públicas, una por estado</dd>
            </div>
            <div>
              <dt>1</dt>
              <dd>foro empresarial regional</dd>
            </div>
            <div>
              <dt>2025</dt>
              <dd>convenio firmado en abril entre el Foro y las universidades</dd>
            </div>
            <div>
              <dt>Fase 1</dt>
              <dd>incidencia regional de los límites planetarios</dd>
            </div>
          </dl>
        </section>

        {/* ---------- Esta plataforma ---------- */}
        <section className="section">
          <p className="kicker">Esta plataforma</p>
          <h2>Cómo se construye</h2>
          <p className="page-intro muted">
            Centraliza, por cada indicador de salud planetaria, su dimensión regional en Baja California, Baja California
            Sur, Sonora, Sinaloa y Nayarit; identifica dónde la región tiene un impacto importante y puede incidir; y ofrece
            gráficas, mapas y referencias accesibles.
          </p>
          <ol className="process">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="grid cols-4 principles">
            {principles.map((p) => (
              <div className="principle" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Marco conceptual ---------- */}
        <section className="section">
          <div className="card framework">
            <div className="prose">
              <p className="kicker">Marco conceptual</p>
              <h2>Los límites planetarios</h2>
              <p>
                Desarrollado por un equipo internacional de científicos liderado por Johan Rockström y Will Steffen, el marco
                establece nueve procesos fundamentales. Cada uno posee un umbral crítico; al transgredirlo aumentan los
                riesgos de cambios ambientales abruptos e irreversibles que comprometen la capacidad de los ecosistemas para
                sostener la vida y el desarrollo económico.
              </p>
              <p>
                A nivel global, la evidencia indica que ya se han superado varios límites. En el Mar de Cortés hay señales
                preocupantes en biodiversidad marina y terrestre, efectos del cambio climático sobre temperatura y
                precipitación, y contaminación que afecta la calidad del agua y la salud de los ecosistemas.
              </p>
            </div>
            <div className="refs">
              <h3>Referencias principales</h3>
              <ul>
                {report && (
                  <li>
                    <a href={report.url} target="_blank" rel="noopener noreferrer">{report.title}</a>
                    <span>{report.organization}</span>
                  </li>
                )}
                {richardson && (
                  <li>
                    <a href={richardson.url} target="_blank" rel="noopener noreferrer">
                      Richardson et al. (2023). {richardson.title}
                    </a>
                    <span>{richardson.organization}</span>
                  </li>
                )}
                <li>
                  <a href="https://doi.org/10.1126/science.1259855" target="_blank" rel="noopener noreferrer">
                    Steffen et al. (2015). Planetary boundaries: Guiding human development on a changing planet
                  </a>
                  <span>Science</span>
                </li>
                <li>
                  <a href="https://doi.org/10.1038/461472a" target="_blank" rel="noopener noreferrer">
                    Rockström et al. (2009). A safe operating space for humanity
                  </a>
                  <span>Nature</span>
                </li>
              </ul>
              <Link to="/fuentes" className="small">Ver el catálogo completo de fuentes →</Link>
            </div>
          </div>
        </section>

        {/* ---------- Red del Corredor ---------- */}
        <section className="section">
          <p className="kicker">Directorio</p>
          <h2>La red del Corredor</h2>

          {corredor && (
            <div className="card coord">
              <div className="coord-head">
                <img src={`${base}img/${corredor.logo}`} alt={corredor.name} />
                <span className="coord-label">Coordinación</span>
              </div>
              <div className="coord-people">
                {corredor.members.map((p) => (
                  <Person p={p} key={p.name} />
                ))}
              </div>
            </div>
          )}

          <h3 className="sub-h">Nodos universitarios</h3>
          <div className="nodes">
            {nodes.map(({ state, org }) => (
              <article className="node" key={org.id}>
                <header>
                  <img src={`${base}img/${org.logo}`} alt="" />
                  <div>
                    <span className="node-state">{state.name}</span>
                    <h4>{shortName(org)}</h4>
                  </div>
                </header>
                <p className="node-name">{org.name.replace(/\s*\([^)]+\)/, '')}</p>
                {org.members.length > 0 ? (
                  org.members.map((p) => <Person p={p} key={p.name} />)
                ) : (
                  <p className="node-empty">{org.note ?? 'Coordinador por confirmar.'}</p>
                )}
              </article>
            ))}
          </div>

          {foro && (
            <>
              <h3 className="sub-h">Sector empresarial</h3>
              <div className="node node-wide">
                <header>
                  <img src={`${base}img/${foro.logo}`} alt="" />
                  <div>
                    <span className="node-state">Iniciativa privada</span>
                    <h4>{foro.name}</h4>
                  </div>
                </header>
                {foro.members.map((p) => (
                  <Person p={p} key={p.name} />
                ))}
              </div>
            </>
          )}
        </section>

        <div className="note about-foot">
          Sitio institucional del Observatorio:{' '}
          <a href="https://ot-mardecortes.com" target="_blank" rel="noopener noreferrer">ot-mardecortes.com</a>. Esta
          plataforma es una iniciativa independiente de divulgación con datos abiertos.
        </div>
      </div>
    </>
  )
}
