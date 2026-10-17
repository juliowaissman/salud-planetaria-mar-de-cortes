import { Link } from 'react-router-dom'
import type { Boundary } from '../types'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import BoundaryArt from './BoundaryArt'
import { boundaryPriority } from '../lib/priority'

/** Tarjeta ilustrada de un límite (índice de límites) */
export default function BoundaryCard({ b }: { b: Boundary }) {
  const fig = b.figures?.find((f) => (f.scope ?? 'regional') === 'regional') ?? b.figures?.[0]
  return (
    <article className="bnd-card">
      <Link to={`/limites/${b.id}`} className="bnd-card-art" tabIndex={-1} aria-hidden="true">
        <BoundaryArt id={b.id} />
        <span className="spot-num">{b.order}</span>
      </Link>
      <div className="bnd-card-body">
        <div className="tag-row">
          <StatusBadge status={b.status} />
          <PriorityBadge priority={boundaryPriority(b)} />
        </div>
        <h3><Link to={`/limites/${b.id}`}>{b.name}</Link></h3>
        <p className="bnd-question">{b.question}</p>
        {fig && (
          <div className="spot-mini-figs one">
            <div>
              <strong>{fig.value}</strong>
              <span>{fig.label}</span>
            </div>
          </div>
        )}
        <Link to={`/limites/${b.id}`} className="bnd-more">Ver el límite <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  )
}
