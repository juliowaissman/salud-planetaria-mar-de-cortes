import { Link } from 'react-router-dom'
import { catalog } from '../data'
import type { Status } from '../types'
import BoundaryCard from '../components/BoundaryCard'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import { assess, boundaryPriority } from '../lib/priority'

const boundaries = [...catalog.boundaries].sort((a, b) => a.order - b.order)

const GROUPS: { status: Status; title: string; text: string }[] = [
  {
    status: 'high-risk',
    title: 'En zona de alto riesgo',
    text: 'Su variable de control rebasa el umbral de alto riesgo, o el límite se considera rebasado de forma severa.',
  },
  {
    status: 'increasing-risk',
    title: 'En zona de riesgo creciente',
    text: 'Su variable de control ya salió del espacio seguro, pero no ha llegado al umbral de alto riesgo.',
  },
  {
    status: 'safe',
    title: 'Dentro del espacio seguro',
    text: 'A escala global siguen dentro del límite, aunque en la región pueden causar daños locales.',
  },
]

export default function Boundaries() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Límites planetarios · Planetary Health Check 2026</p>
          <h1>Nueve procesos que mantienen estable al planeta</h1>
          <p className="lead">
            Los límites planetarios marcan hasta dónde puede presionar la humanidad a la Tierra sin poner en riesgo su
            estabilidad. Aquí se lee cada uno desde el Mar de Cortés: cómo está el planeta, qué pasa en la región y qué se
            puede hacer.
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="spot-intro bnd-intro">
          <div className="prose">
            <p className="kicker">Cómo leer esta sección</p>
            <h2>Un diagnóstico global y una lectura regional</h2>
            <p>
              Cada límite tiene una o más <strong>variables de control</strong> que se miden a escala mundial. El{' '}
              <em>Planetary Health Check 2026</em> compara su valor actual con un límite seguro y con un umbral de alto
              riesgo. Hoy siete de los nueve límites están rebasados.
            </p>
            <p>
              Pero un límite global no dice qué tan grave es el problema en el noroeste de México ni cuánto puede hacer la
              región para corregirlo. Por eso cada página agrega un diagnóstico regional y una{' '}
              <Link to="/priorizacion">prioridad</Link> que combina el impacto en la región con su capacidad de actuar.
            </p>
          </div>
          <div className="table-scroll">
            <table className="ptable spot-summary compact">
              <thead>
                <tr><th>Límite</th><th>Estado global</th><th>Prioridad regional</th></tr>
              </thead>
              <tbody>
                {boundaries.map((b) => {
                  const a = assess(b)
                  return (
                    <tr key={b.id}>
                      <td className="bnd-tname"><Link to={`/limites/${b.id}`}>{b.order}. {b.name}</Link></td>
                      <td><StatusBadge status={b.status} /></td>
                      <td title={a ? `Impacto ${a.impact.toFixed(2)} · apalancamiento ${a.leverage.toFixed(2)}` : undefined}>
                        <PriorityBadge priority={boundaryPriority(b)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {GROUPS.map((g) => {
          const items = boundaries.filter((b) => b.status === g.status)
          if (items.length === 0) return null
          return (
            <section className={`bnd-group ${g.status}`} key={g.status}>
              <div className="bnd-group-head">
                <h2>{g.title} <span className="bnd-count">{items.length}</span></h2>
                <p className="muted">{g.text}</p>
              </div>
              <div className={`bnd-grid n${Math.min(items.length, 4)}`}>
                {items.map((b) => <BoundaryCard key={b.id} b={b} />)}
              </div>
            </section>
          )
        })}

        <p className="small muted" style={{ marginTop: 28 }}>
          Fuente global: Planetary Boundaries Science (2026). <em>Planetary Health Check 2026</em>. Potsdam Institute for
          Climate Impact Research. Las lecturas regionales y las calificaciones son del Observatorio Tecnológico del Mar de
          Cortés. Ver también los <Link to="/spotlights">temas emergentes</Link>.
        </p>
      </div>
    </>
  )
}
