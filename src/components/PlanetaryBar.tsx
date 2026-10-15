import { catalog } from '../data'
import type { Status } from '../types'
import { statusLabel } from './StatusBadge'

// Qualitative position per official status classification (0–100 across the three zones).
const POS: Record<Status, number> = {
  safe: 18,
  'increasing-risk': 52,
  'high-risk': 86,
  'not-quantified': 86,
}

export default function PlanetaryBar() {
  const cvs = catalog.controlVariables
  return (
    <div>
      <div className="pb-legend">
        <span><i className="lg-safe" />Seguro</span>
        <span><i className="lg-risk" />Riesgo creciente</span>
        <span><i className="lg-high" />Alto riesgo</span>
      </div>
      <p className="plate-caption">Lámina · 13 variables de control</p>
      <div className="pb-list">
        {cvs.map((cv) => {
          const pos = POS[cv.status]
          return (
            <div className="pb-row" key={cv.id}>
              <div className="pb-label">
                <span className="pb-name">{cv.name}</span>
                <span className="pb-value">{cv.globalValue}</span>
                <span className="pb-status">{statusLabel(cv.status)}</span>
              </div>
              <div className="pb-track" aria-hidden="true">
                <div className="pb-zone z-safe" />
                <div className="pb-zone z-risk" />
                <div className="pb-zone z-high" />
                <div className="pb-marker" style={{ left: `${pos}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <p className="small muted" style={{ marginTop: 10 }}>
        Posición cualitativa según la clasificación oficial de riesgo del Planetary Health Check 2026. Las variables de
        integridad de la biosfera y entidades nuevas no tienen zona de riesgo cuantificada.
      </p>
    </div>
  )
}
