import { Link } from 'react-router-dom'
import { catalog } from '../data'
import PriorityMatrix from '../components/PriorityMatrix'
import { PriorityBadge } from '../components/StatusBadge'
import { priorityOf, priorityScoreOf } from '../lib/priority'

export default function Prioritization() {
  const sorted = [...catalog.boundaries].sort(
    (a, b) =>
      priorityScoreOf(b.regional.impact, b.regional.leverage) -
        priorityScoreOf(a.regional.impact, a.regional.leverage) ||
      a.order - b.order,
  )

  return (
    <div className="container section">
      <h1>Priorización regional</h1>
      <p className="muted page-intro">
        No todos los límites planetarios merecen el mismo esfuerzo desde el Mar de Cortés. Priorizamos donde hay{' '}
        <strong>alto impacto regional</strong> (la región ya lo sufre) y <strong>alto apalancamiento</strong> (la iniciativa
        privada y los gobiernos locales pueden incidir). Evitamos concentrar recursos donde la región apenas incide, como
        su huella de carbono global o el ozono estratosférico.
      </p>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Matriz impacto × apalancamiento</h2>
        <PriorityMatrix height={440} />
        <p className="small muted" style={{ marginTop: 6 }}>
          Posición según impacto regional (eje Y) y apalancamiento regional (eje X). Las líneas punteadas separan las
          zonas Alta/Media/Baja. Cuanto más arriba y a la derecha, más sentido tiene actuar como región.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Tabla de priorización</h2>
        <div className="table-scroll">
          <table className="ptable">
            <thead>
              <tr>
                <th>Límite planetario</th>
                <th>Impacto regional</th>
                <th>Apalancamiento</th>
                <th>Prioridad</th>
                <th>Lectura regional</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => (
                <tr key={b.id}>
                  <td><Link to={`/limites/${b.id}`}>{b.name}</Link></td>
                  <td>{b.regional.impact}</td>
                  <td>{b.regional.leverage}</td>
                  <td><PriorityBadge priority={priorityOf(b.regional.impact, b.regional.leverage)} /></td>
                  <td className="small muted">{b.regional.summary.slice(0, 140)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Metodología</h2>
        <div className="prose">
          <ul>
            <li>
              <strong>Impacto regional:</strong> grado en que el límite ya se manifiesta en los 5 estados del Mar de Cortés
              (evidencia de estrés, daños o riesgos observables). Alto = 3, Medio = 2, Bajo = 1.
            </li>
            <li>
              <strong>Apalancamiento regional:</strong> capacidad real de la iniciativa privada y los gobiernos locales de
              influir en la variable, considerando que algunos límites son procesos globales (p. ej. CO₂ atmosférico u
              ozono) donde la acción local es marginal. Alto = 3, Medio = 2, Bajo = 1.
            </li>
            <li>
              <strong>Prioridad = impacto × apalancamiento</strong> (producto de 1 a 9): <strong>Alta</strong> con 6 o más
              (impacto alto y apalancamiento al menos medio), <strong>Media</strong> con 3–4, y <strong>Baja</strong> con 1–2.
            </li>
          </ul>
          <p>
            <em>Ejemplo de despriorización:</em> la huella de carbono de la región es pequeña a escala global (bajo
            apalancamiento sobre la concentración de CO₂), aunque los <strong>impactos</strong> climáticos sí sean altos; por
            eso el límite climático se trata en clave de adaptación, no de mitigación global.
          </p>
        </div>
      </div>
    </div>
  )
}
