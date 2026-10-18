import type { OpenQuestion } from '../types'

export default function QuestionList({ questions }: { questions: OpenQuestion[] }) {
  return (
    <ul className="action-list">
      {questions.map((q, i) => (
        <li key={i} style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 600 }}>{q.q}</div>
          <div>{q.action}</div>
        </li>
      ))}
    </ul>
  )
}
