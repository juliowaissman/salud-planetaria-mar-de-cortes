import { Link } from 'react-router-dom'
import type { RegionalAssessment } from '../types'
import { assess, CRITERIA } from '../lib/priority'

// Tabla de los seis criterios del método de priorización y su resultado.
export default function PriorityEvaluation({ regional }: { regional: RegionalAssessment }) {
  const evaluation = assess({ regional })
  if (!evaluation || !regional.scores) return null
  return (
    <>
      <p className="chart-subtitle">
        Calificación de 1 a 4 de cada criterio. Cada eje es la media geométrica de sus tres criterios; la prioridad es alta
        solo si ambos ejes llegan a 3. <Link to="/priorizacion">Ver la metodología completa →</Link>
      </p>
      <div className="table-scroll">
        <table className="ptable">
          <thead>
            <tr><th>Eje</th><th>Criterio</th><th>Calificación</th><th>Justificación</th></tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.id}>
                <td className="small">{c.axis === 'impact' ? 'Impacto' : 'Apalancamiento'}</td>
                <td>{c.name}</td>
                <td className="num"><strong>{regional.scores![c.id].value}</strong></td>
                <td className="small">{regional.scores![c.id].why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small" style={{ marginTop: 10 }}>
        <strong>Impacto</strong> {evaluation.impact.toFixed(2)} ({evaluation.impactLevel}) ·{' '}
        <strong>Apalancamiento</strong> {evaluation.leverage.toFixed(2)} ({evaluation.leverageLevel}) ·{' '}
        <strong>Prioridad</strong> {evaluation.priority} ·{' '}
        {evaluation.robust
          ? 'Clasificación robusta: ningún cambio de un punto en un solo criterio la modifica.'
          : `Clasificación sensible: ${evaluation.sensitiveTo.join('; ')}.`}
      </p>
    </>
  )
}
