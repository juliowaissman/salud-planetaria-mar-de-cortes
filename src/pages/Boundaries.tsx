import { catalog } from '../data'
import BoundaryCard from '../components/BoundaryCard'

export default function Boundaries() {
  return (
    <div className="container section">
      <h1>Límites planetarios</h1>
      <p className="muted page-intro">
        Los nueve procesos que regulan la estabilidad y resiliencia del sistema Tierra, con su estado global (2026) y su
        prioridad para la región del Mar de Cortés. Haz clic en cada límite para ver el diagnóstico regional, las variables
        de control, gráficas, mapas y referencias.
      </p>
      <div className="grid cols-3" style={{ marginTop: 20 }}>
        {catalog.boundaries.map((b) => (
          <BoundaryCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  )
}
