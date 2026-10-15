import { catalog } from '../data'

const base = import.meta.env.BASE_URL

function initials(name: string) {
  return name
    .replace(/^(Dr\.|Dra\.|Mtro\.|Mtra\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export default function About() {
  return (
    <div className="container section">
      <h1>Acerca del Observatorio</h1>

      <div className="prose">
        <p>
          El <strong>Observatorio Tecnológico del Mar de Cortés</strong> articula ciencia, innovación y sostenibilidad para la
          región del Golfo de California. En su primera fase se enfoca en analizar la incidencia regional de los{' '}
          <strong>límites planetarios</strong>: nueve procesos biofísicos que regulan la estabilidad y resiliencia del sistema
          terrestre, con umbrales que definen una zona de operación segura para la humanidad.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Universidades participantes</h2>
        <ul className="prose">
          {catalog.states.map((s) => (
            <li key={s.id}>
              <strong>{s.name}:</strong> {s.university}
            </li>
          ))}
        </ul>
        <p className="small muted">
          Convenio firmado en abril de 2025 entre Foro Mar de Cortés y las cinco universidades públicas de la región.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Marco conceptual: límites planetarios</h2>
        <div className="prose">
          <p>
            Desarrollado por un equipo internacional de científicos liderado por Johan Rockström y Will Steffen, el marco
            establece nueve procesos fundamentales. Cada uno posee un umbral crítico; al transgredirlo aumentan los riesgos
            de cambios ambientales abruptos e irreversibles que comprometen la capacidad de los ecosistemas para sostener la
            vida y el desarrollo económico.
          </p>
          <p>
            A nivel global, la evidencia indica que ya se han superado varios límites. En el Mar de Cortés hay señales
            preocupantes en biodiversidad marina y terrestre, efectos del cambio climático sobre temperatura y precipitación,
            y contaminación que afecta la calidad del agua y la salud de los ecosistemas.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Propósito de esta plataforma</h2>
        <div className="prose">
          <p>
            Centralizar, por cada indicador de salud planetaria, su dimensión regional en los estados de Baja California,
            Baja California Sur, Sonora, Sinaloa y Nayarit; identificar dónde la región tiene un impacto importante y puede
            incidir; y ofrecer gráficas, mapas y referencias accesibles para investigadores, tomadores de decisiones y la
            sociedad.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Directorio</h2>
        {catalog.directory.map((org) => (
          <div className="dir-org" key={org.id}>
            <div className="dir-org-head">
              <img src={`${base}img/${org.logo}`} alt={org.name} className={org.wide ? 'wide' : ''} />
              <h3>{org.name}</h3>
            </div>
            {org.note ? (
              <p className="small muted">{org.note}</p>
            ) : org.members.length > 0 ? (
              <div className="dir-members">
                {org.members.map((p) => (
                  <div className="dir-person" key={p.name}>
                    {p.photo ? (
                      <img src={`${base}img/${p.photo}`} alt={p.name} />
                    ) : (
                      <span className="avatar" aria-hidden="true">{initials(p.name)}</span>
                    )}
                    <div>
                      <div className="pname">{p.name}</div>
                      <div className="prole">{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <p className="small muted" style={{ marginTop: 16 }}>
        Sitio institucional:{' '}
        <a href="https://ot-mardecortes.com" target="_blank" rel="noopener noreferrer">
          ot-mardecortes.com
        </a>{' '}
        · Esta plataforma es una iniciativa independiente de divulgación con datos abiertos.
      </p>
    </div>
  )
}
