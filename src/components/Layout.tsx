import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { catalog } from '../data'

const base = import.meta.env.BASE_URL

const nav = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/limites', label: 'Límites planetarios' },
  { to: '/spotlights', label: 'Análisis a fondo' },
  { to: '/priorizacion', label: 'Priorización' },
  { to: '/fuentes', label: 'Fuentes' },
  { to: '/acerca', label: 'Acerca' },
]

// Red institucional (el logo del Corredor ya va en la franja superior)
const partners = catalog.directory.filter((o) => o.id !== 'corredor')

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Cerrar el menú móvil y volver arriba al cambiar de página
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <button
        className="skip-link"
        type="button"
        onClick={() => document.getElementById('main')?.focus()}
      >
        Saltar al contenido
      </button>

      <div className="inst-bar">
        <div className="inner">
          <Link to="/" className="logo-link" aria-label="Inicio">
            <img
              src={`${base}img/logo-corredor.png`}
              alt="Corredor Científico, Académico y Empresarial del Mar de Cortés"
            />
          </Link>
          <span className="inst-text">
            <strong>Observatorio Tecnológico del Mar de Cortés</strong>
            <br />
            Foro Mar de Cortés · UABC · UABCS · UAN · UAS · Unison
          </span>
        </div>
      </div>

      <header className="site-header">
        <div className="bar">
          <Link to="/" className="brand">
            Salud Planetaria · Mar de Cortés
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="label">{menuOpen ? 'Cerrar' : 'Menú'}</span>
          </button>
          <nav id="main-nav" className={`nav${menuOpen ? ' open' : ''}`} aria-label="Principal">
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

      <section className="partners" aria-label="Instituciones participantes">
        <div className="container">
          <p className="label">Una iniciativa de</p>
          <div className="logos">
            {partners.map((p) => (
              <Link to="/acerca" key={p.id} title={p.name}>
                <img src={`${base}img/${p.logo}`} alt="" loading="lazy" />
                <span>{p.name.match(/\(([^)]+)\)/)?.[1] ?? p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                <br />
                <Link to="/fuentes">Catálogo de fuentes</Link>
              </p>
            </div>
          </div>
          <p className="fine">
            Última actualización: {catalog.updated} · Las fuentes globales corresponden al Planetary Health Check 2026;
            los datos regionales provienen de fuentes públicas. Imagen satelital de portada: NASA.
          </p>
        </div>
      </footer>
    </>
  )
}
