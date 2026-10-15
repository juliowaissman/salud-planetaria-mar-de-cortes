import type { Status, Trend, Priority } from '../types'

const STATUS_LABEL: Record<Status, string> = {
  safe: 'Dentro del espacio seguro',
  'increasing-risk': 'Zona de riesgo creciente',
  'high-risk': 'Zona de alto riesgo',
  'not-quantified': 'No cuantificado',
}

export function statusLabel(s: Status) {
  return STATUS_LABEL[s]
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge ${status}`}>
      <span className="dot" />
      {statusLabel(status)}
    </span>
  )
}

export function TrendBadge({ trend }: { trend: Trend }) {
  const label: Record<Trend, string> = {
    worsening: 'Empeora',
    improving: 'Mejora',
    stable: 'Estable',
    unknown: 'Desconocido',
  }
  const cls: Record<Trend, string> = {
    worsening: 'trend-worsening',
    improving: 'trend-improving',
    stable: 'trend-stable',
    unknown: 'trend-stable',
  }
  return <span className={`badge ${cls[trend]}`}>{label[trend]}</span>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cls =
    priority === 'Alta' ? 'priority-high' : priority === 'Media' ? 'priority-medium' : 'priority-low'
  return <span className={`badge ${cls}`}>Prioridad {priority}</span>
}
