import { Link } from 'react-router-dom'
import { catalog } from '../data'
import PlanetaryBar from '../components/PlanetaryBar'
import PriorityMatrix from '../components/PriorityMatrix'
import BoundaryCard from '../components/BoundaryCard'

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
        </section>

        <section className="section">
          <div className="section-title">
            <h2>Dónde actuar como región</h2>
            <Link to="/priorizacion" className="small">
              Metodología de priorización →
            </Link>
          </div>
          <div className="card">
            <p className="muted" style={{ marginTop: 0 }}>
              Priorizamos los límites con <strong>alto impacto regional</strong> y <strong>alto apalancamiento</strong> desde la
              iniciativa privada y los gobiernos locales. Ejemplos de bajo apalancamiento —como la huella de carbono de la
              región o el ozono estratosférico— se marcan para <em>no</em> concentrar recursos en ellos.
            </p>
            <PriorityMatrix />
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <h2>Límites planetarios</h2>
          </div>
          <div className="grid cols-3">
            {catalog.boundaries.map((b) => (
              <BoundaryCard key={b.id} b={b} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
