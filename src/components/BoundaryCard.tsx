import { Link } from 'react-router-dom'
import type { Boundary } from '../types'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import { regionalIds } from '../data/regional'
import { boundaryPriority } from '../lib/priority'

const withData = new Set(regionalIds())

export default function BoundaryCard({ b }: { b: Boundary }) {
  return (
    <Link to={`/limites/${b.id}`} className="card boundary-card">
      <span className="order">Límite {b.order} de 9</span>
      <h2>{b.name}</h2>
      <span className="muted small">{b.nameEn}</span>
      <p className="desc">{b.short}</p>
      <div className="meta">
        <StatusBadge status={b.status} />
        <PriorityBadge priority={boundaryPriority(b)} />
        {withData.has(b.id) && <span className="badge info">Con datos regionales</span>}
      </div>
    </Link>
  )
}
