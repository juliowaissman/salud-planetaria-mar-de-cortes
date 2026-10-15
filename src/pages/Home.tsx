import { Link } from 'react-router-dom'
import { catalog } from '../data'
import PlanetaryBar from '../components/PlanetaryBar'
import PriorityMatrix from '../components/PriorityMatrix'
import BoundaryCard from '../components/BoundaryCard'

export default function Home() {
  const transgressed = catalog.boundaries.filter((b) => b.status !== 'safe')
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>{catalog.title}</h1>
          <p className="lead">{catalog.subtitle}</p>
          <div className="chips">
            {catalog.states.map((s) => (
              <span className="chip" key={s.id}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="grid cols-3">
            <div className="card">
              <div className="metric">
                <span className="value">{transgressed.length} / 9</span>
                <span className="label">límites transgredidos a nivel global (2026)</span>
              </div>
            </div>
            <div className="card">
              <div className="metric">
                <span className="value">13</span>
                <span className="label">variables de control evaluadas</span>
              </div>
            </div>
            <div className="card">
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
              El Planetary Health Check 2026 evalúa 13 variables de control en 9 procesos del sistema Tierra.
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
