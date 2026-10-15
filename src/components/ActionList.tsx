import type { Action } from '../types'

export default function ActionList({ actions }: { actions: Action[] }) {
  if (actions.length === 0) return null
  return (
    <ul className="action-list">
      {actions.map((a, i) => (
        <li key={i}>
          <span>{a.text}</span>
        </li>
      ))}
    </ul>
  )
}
