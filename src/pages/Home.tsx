import { Link } from 'react-router-dom'
import { catalog, sourceById } from '../data'
import PlanetaryBar from '../components/PlanetaryBar'
import { ShortReference } from '../lib/cite'

const report = sourceById.get('phc-main')
const reportDownloads = 'https://www.planetaryhealthcheck.org/downloads/'
const heroImage = `${import.meta.env.BASE_URL}img/hero-mar-cortes.jpg`

const entries = [
  {
    who: 'Gobierno e iniciativa privada',
    title: 'Tomo decisiones',
    text: 'Dónde tiene la región impacto y capacidad de incidir: la matriz de priorización y las acciones por límite.',
    to: '/priorizacion',
    go: 'Ver la priorización →',
  },
  {
    who: 'Academia e investigación',
    title: 'Investigo',
    text: 'Datos regionales por estado, variables de control, brechas de medición y referencias citables con fecha de acceso.',
    to: '/limites',
    go: 'Explorar los 9 límites →',
  },
  {
    who: 'Sociedad y medios',
    title: 'Quiero entender',
    text: 'Qué son los límites planetarios, por qué importan para el Golfo de California y quién está detrás de este esfuerzo.',
    to: '/acerca',
    go: 'Conocer el marco →',
  },
]

export default function Home() {
  const transgressed = catalog.boundaries.filter((b) => b.status !== 'safe')
  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(7,42,74,0.92) 0%, rgba(7,42,74,0.78) 45%, rgba(7,42,74,0.35) 100%), url(${heroImage})`,
        }}
      >
        <div className="container">
          <p className="eyebrow">Observatorio Tecnológico del Mar de Cortés</p>
          <h1>{catalog.title}</h1>
          <p className="lead">
            {catalog.subtitle} para los cinco estados del Golfo de California, a partir del Planetary Health Check 2026.
          </p>
          <div className="chips" aria-label="Estados incluidos">
            {catalog.states.map((s) => (
              <span className="chip" key={s.id}>
                {s.name}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            <Link to="/limites" className="btn btn-primary">Ver los 9 límites</Link>
            <Link to="/priorizacion" className="btn btn-ghost">Dónde actuar como región</Link>
          </div>
        </div>
        <span className="credit">Imagen satelital: NASA</span>
      </section>

      <div className="container">
        <section className="section" aria-labelledby="start-title">
          <div className="section-title">
            <h2 id="start-title">¿Por dónde empezar?</h2>
          </div>
          <div className="grid cols-3">
            {entries.map((e) => (
              <Link to={e.to} className="card entry-card" key={e.to}>
                <span className="who">{e.who}</span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                <span className="go">{e.go}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="about-title">
          <div className="section-title">
            <h2 id="about-title">Sobre esta plataforma</h2>
            <Link to="/acerca" className="small">Conocer al Observatorio →</Link>
          </div>
          <div className="grid cols-2">
            <div className="card context-card">
              <p className="kicker">Quién la hace</p>
              <h3>Observatorio Tecnológico del Mar de Cortés</h3>
              <p>
                Es una iniciativa del <strong>Foro Mar de Cortés</strong> y de las cinco universidades públicas de la
                región —UABC, UABCS, UAN, UAS y Unison—, articulada por el Corredor Científico, Académico y Empresarial
                del Mar de Cortés. Su propósito es unir ciencia, innovación y sostenibilidad para el Golfo de California.
              </p>
              <p>
                En su primera fase analiza la <strong>incidencia regional de los límites planetarios</strong>: qué tan
                presente está cada uno en Baja California, Baja California Sur, Sonora, Sinaloa y Nayarit, y dónde la
                región puede hacer algo al respecto.
              </p>
            </div>
            <div className="card context-card">
              <p className="kicker">Qué ofrece</p>
              <h3>Del diagnóstico global a la decisión regional</h3>
              <ol className="steps">
                <li><strong>Estado global.</strong> Parte del Planetary Health Check 2026, la evaluación científica más reciente de los 9 límites.</li>
                <li><strong>Lectura regional.</strong> Reúne datos públicos por estado (INEGI, CONAGUA, CONABIO, SEMARNAT, NOAA, entre otros), con fuente y fecha de consulta.</li>
                <li><strong>Priorización.</strong> Cruza el impacto regional con la capacidad de incidir para señalar dónde conviene concentrar esfuerzos.</li>
                <li><strong>Agenda.</strong> Propone preguntas abiertas y señala lo que hoy no se mide, para academia, empresas y gobiernos.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="what-title">
          <div className="card explainer">
            <div>
              <p className="kicker">Marco conceptual</p>
              <h2 id="what-title" style={{ marginBottom: 8 }}>¿Qué son los límites planetarios?</h2>
              <p className="big">
                Nueve procesos que regulan la estabilidad del sistema Tierra, cada uno con un umbral que define un espacio
                de operación seguro para la humanidad.
              </p>
            </div>
            <div className="prose">
              <p>
                El marco, desarrollado por un equipo internacional liderado por Johan Rockström y Will Steffen, advierte que
                al transgredir esos umbrales aumentan los riesgos de cambios ambientales abruptos e irreversibles.
              </p>
              <p style={{ marginBottom: 0 }}>
                Este sitio lleva ese diagnóstico global a la escala del Mar de Cortés y pregunta, límite por límite, si la
                región tiene un impacto relevante y si puede incidir en él. <Link to="/acerca">Más sobre el marco →</Link>
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Cifras clave">
          <div className="grid cols-3">
            <div className="card metric-card">
              <div className="metric">
                <span className="value">{transgressed.length} de 9</span>
                <span className="label">límites transgredidos a nivel global (2026)</span>
              </div>
            </div>
            <div className="card metric-card">
              <div className="metric">
                <span className="value">13</span>
                <span className="label">variables de control evaluadas</span>
              </div>
            </div>
            <div className="card metric-card">
              <div className="metric">
                <span className="value">5</span>
                <span className="label">estados del Mar de Cortés</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <h2>5 mensajes clave del reporte 2026</h2>
            {report && (
              <a href={reportDownloads} target="_blank" rel="noopener noreferrer" className="small">
                Consultar el reporte original (en inglés) ↗
              </a>
            )}
          </div>
          <div className="card">
            <ol className="prose" style={{ marginBottom: 0 }}>
              {catalog.keyTakeaways.map((k) => (
                <li key={k.n}>{k.text}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <h2>Diagnóstico planetario 2026</h2>
            <Link to="/limites" className="small">
              Ver los 9 límites →
            </Link>
          </div>
          <div className="card">
            <p className="muted" style={{ marginTop: 0 }}>
              El Planetary Health Check 2026 evalúa 13 variables de control en 9 procesos del sistema Tierra.{' '}
              {transgressed.length} de 9 límites están transgredidos y sus tendencias siguen empeorando.
            </p>
            <PlanetaryBar />
          </div>
          {report && (
            <p className="report-ref">
              <span>
                <strong>Fuente:</strong> <ShortReference r={report} />
              </span>
              <a href={reportDownloads} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Descargar el reporte ↗
              </a>
            </p>
          )}
        </section>

      </div>
    </>
  )
}
