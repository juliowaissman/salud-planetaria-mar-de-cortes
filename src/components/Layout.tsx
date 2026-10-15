import { NavLink, Link, Outlet } from 'react-router-dom'
import { catalog } from '../data'

const nav = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/limites', label: 'Límites planetarios' },
  { to: '/spotlights', label: 'Análisis a fondo' },
  { to: '/priorizacion', label: 'Priorización' },
  { to: '/fuentes', label: 'Fuentes' },
  { to: '/acerca', label: 'Acerca' },
]

export default function Layout() {
  return (
    <>
      <button
        className="skip-link"
        type="button"
        onClick={() => document.getElementById('main')?.focus()}
      >
        Saltar al contenido
      </button>
      <header className="site-header">
        <div className="bar">
          <Link to="/" className="brand">
            <span className="brand-logo">
              <img
                src={`${import.meta.env.BASE_URL}img/logo-corredor.png`}
                alt="Corredor Científico y Tecnológico del Mar de Cortés"
              />
            </span>
            <span>
              <span className="title">Salud Planetaria · Mar de Cortés</span>
              <br />
              <span className="sub">Observatorio Tecnológico del Mar de Cortés</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Principal">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="cols">
            <div>
              <h4>Salud Planetaria · Mar de Cortés</h4>
              <p>
                Diagnóstico regional de los límites planetarios para Baja California, Baja California Sur, Sonora,
                Sinaloa y Nayarit.
              </p>
            </div>
            <div>
              <h4>Basado en</h4>
              <p>
                Planetary Health Check 2026 (Potsdam Institute for Climate Impact Research / PBScience) y el marco de
                límites planetarios (Rockström et al. 2009; Steffen et al. 2015).
              </p>
            </div>
            <div>
              <h4>Enlaces</h4>
              <p>
                <a href="https://ot-mardecortes.com" target="_blank" rel="noopener noreferrer">
                  Observatorio Tecnológico del Mar de Cortés
                </a>
                <br />
                <a href="https://www.planetaryhealthcheck.org" target="_blank" rel="noopener noreferrer">
                  Planetary Health Check
                </a>
              </p>
            </div>
          </div>
          <p className="fine">
            Última actualización: {catalog.updated} · Las fuentes globales corresponden al Planetary Health Check 2026;
            los datos regionales provienen de fuentes públicas.
          </p>
        </div>
      </footer>
    </>
  )
}
