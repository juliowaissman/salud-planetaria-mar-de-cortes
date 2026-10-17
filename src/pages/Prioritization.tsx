import { Link } from 'react-router-dom'
import { catalog } from '../data'
import PriorityMatrix from '../components/PriorityMatrix'
import { PriorityBadge } from '../components/StatusBadge'
import { assess, compareByPriority, CRITERIA, IMPACT_CRITERIA, LEVERAGE_CRITERIA } from '../lib/priority'

const fmt = (n: number) => n.toFixed(2)

export default function Prioritization() {
  const rows = [...catalog.boundaries]
    .sort((a, b) => compareByPriority(a, b) || a.order - b.order)
    .map((b) => ({ b, a: assess(b)! }))

  return (
    <div className="container section">
      <h1>Priorización regional</h1>
      <p className="muted page-intro">
        No todos los límites planetarios merecen el mismo esfuerzo desde el Mar de Cortés. Priorizamos donde la región
        sufre un <strong>impacto alto</strong> y, al mismo tiempo, tiene un <strong>apalancamiento alto</strong>: las causas
        están en la región y los actores regionales pueden actuar con soluciones viables. Cada límite se califica con seis
        criterios explícitos; la metodología completa está al final de esta página.
      </p>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Matriz impacto × apalancamiento</h2>
        <PriorityMatrix height={460} />
        <p className="small muted" style={{ marginTop: 6 }}>
          Cada punto es un límite planetario, ubicado por su calificación de impacto (eje vertical) y de apalancamiento
          (eje horizontal), ambos de 1 a 4. Las líneas punteadas marcan los umbrales de 2 (nivel medio) y 3 (nivel alto);
          la zona sombreada es la de prioridad alta.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Tabla de priorización</h2>
        <div className="table-scroll">
          <table className="ptable compact">
            <thead>
              <tr>
                <th>Límite planetario</th>
                {IMPACT_CRITERIA.map((c) => <th key={c.id} title={c.question}>{c.id === 'irreversibilidad' ? 'Irrevers.' : c.name}</th>)}
                <th>Impacto</th>
                {LEVERAGE_CRITERIA.map((c) => <th key={c.id} title={c.question}>{c.id === 'factibilidad' ? 'Factib.' : c.id === 'competencia' ? 'Compet.' : 'Control'}</th>)}
                <th>Apalanc.</th>
                <th>Prioridad</th>
                <th>Robustez</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ b, a }) => (
                <tr key={b.id}>
                  <td><Link to={`/limites/${b.id}`}>{b.name}</Link></td>
                  {IMPACT_CRITERIA.map((c) => <td key={c.id} className="num">{b.regional.scores![c.id].value}</td>)}
                  <td className="num"><strong>{fmt(a.impact)}</strong><br /><span className="small muted">{a.impactLevel}</span></td>
                  {LEVERAGE_CRITERIA.map((c) => <td key={c.id} className="num">{b.regional.scores![c.id].value}</td>)}
                  <td className="num"><strong>{fmt(a.leverage)}</strong><br /><span className="small muted">{a.leverageLevel}</span></td>
                  <td><PriorityBadge priority={a.priority} /></td>
                  <td className="small">{a.robust ? 'Robusta' : <strong>Sensible</strong>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small" style={{ marginTop: 10, marginBottom: 4 }}><strong>Clasificaciones sensibles</strong> (qué cambio de un punto en un criterio modificaría la prioridad):</p>
        <ul className="small" style={{ marginTop: 0 }}>
          {rows.filter(({ a }) => !a.robust).map(({ b, a }) => (
            <li key={b.id}><strong>{b.name}:</strong> {a.sensitiveTo.join('; ')}.</li>
          ))}
        </ul>
        <p className="small muted" style={{ marginTop: 8 }}>
          Los criterios de apalancamiento son: control regional de las causas, competencia de los actores regionales y
          factibilidad de soluciones. La justificación de cada calificación está en la página de cada límite, en la sección
          «Evaluación para la priorización».
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }} id="metodologia">
        <h2>Metodología</h2>
        <div className="prose">
          <p>
            El método adapta dos marcos establecidos. Para el <strong>impacto</strong> usa los tres criterios con que los
            Estándares Abiertos para la Práctica de la Conservación califican una amenaza: alcance, severidad e
            irreversibilidad, cada uno en cuatro niveles. Para el <strong>apalancamiento</strong> parte de la distinción de
            Häyhä et al. (2016) entre los límites que dependen de un presupuesto global (clima, ozono) y los que dependen de
            condiciones locales (biodiversidad, agua, suelo, nutrientes), y la combina con la competencia de los actores y la
            factibilidad de las soluciones, como en la evaluación de estrategias de los mismos Estándares.
          </p>

          <h3>Paso 1. Calificar seis criterios de 1 a 4</h3>
          <p>Cada criterio se califica con la evidencia verificada del límite, según estas definiciones:</p>
        </div>
        <div className="table-scroll">
          <table className="ptable">
            <thead>
              <tr><th>Eje</th><th>Criterio</th><th>4</th><th>3</th><th>2</th><th>1</th></tr>
            </thead>
            <tbody>
              {CRITERIA.map((c) => (
                <tr key={c.id}>
                  <td className="small">{c.axis === 'impact' ? 'Impacto' : 'Apalancamiento'}</td>
                  <td><strong>{c.name}</strong><br /><span className="small muted">{c.question}</span></td>
                  {([4, 3, 2, 1] as const).map((v) => <td key={v} className="small">{c.levels[v]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose" style={{ marginTop: 16 }}>
          <h3>Paso 2. Calcular cada eje con la media geométrica</h3>
          <p>
            <strong>Impacto</strong> = ∛(alcance × severidad × irreversibilidad)
            <br />
            <strong>Apalancamiento</strong> = ∛(control × competencia × factibilidad)
          </p>
          <p>
            Ambos resultados van de 1 a 4. Se usa la media geométrica, y no la suma, porque un criterio bajo no se compensa
            con otros altos: un problema grave pero cuyas causas son globales no alcanza un apalancamiento alto solo porque
            existan algunas soluciones locales. El manual de la OCDE y el JRC sobre indicadores compuestos describe esta agregación como
            menos compensatoria que la suma, adecuada cuando no se quiere que un componente bajo se oculte.
          </p>
          <p>
            <em>Ejemplo:</em> el cambio climático tiene control 1, competencia 3 y factibilidad 3. Su apalancamiento es
            ∛(1 × 3 × 3) = ∛9 = 2.08 (nivel medio). Con un promedio simple habría salido 2.33: la media geométrica castiga más el criterio bajo.
          </p>

          <h3>Paso 3. Asignar el nivel de cada eje</h3>
          <ul>
            <li><strong>Alto:</strong> 3.0 o más (en promedio, todos los criterios en nivel 3 o superior).</li>
            <li><strong>Medio:</strong> de 2.0 a menos de 3.0.</li>
            <li><strong>Bajo:</strong> menos de 2.0.</li>
          </ul>

          <h3>Paso 4. Clasificar la prioridad con una regla estricta</h3>
          <ul>
            <li><strong>Alta:</strong> impacto alto <em>y</em> apalancamiento alto. Es el único caso en que conviene concentrar recursos regionales.</li>
            <li><strong>Baja:</strong> impacto bajo <em>o</em> apalancamiento bajo.</li>
            <li><strong>Media:</strong> el resto (al menos un eje medio y ninguno bajo).</li>
          </ul>
          <p>
            Dentro de cada clase, los límites se ordenan por el producto impacto × apalancamiento. Una prioridad media o baja
            no significa que el problema no importe: en el cambio climático, por ejemplo, el impacto es el más alto posible,
            pero la región no controla sus causas, así que su respuesta debe centrarse en la adaptación.
          </p>

          <h3>Paso 5. Probar la sensibilidad</h3>
          <p>
            Para cada límite se cambia un criterio a la vez un punto hacia arriba y hacia abajo. Si ningún cambio modifica la
            prioridad, la clasificación es <strong>robusta</strong>; si alguno la modifica, es <strong>sensible</strong> y la
            tabla indica qué criterio y en qué dirección. Las clasificaciones sensibles son las que más conviene revisar
            cuando aparezca nueva evidencia.
          </p>

          <h3>Limitaciones</h3>
          <ul>
            <li>Las calificaciones son un juicio experto basado en la evidencia de cada límite; no son mediciones.</li>
            <li>La evidencia regional es desigual entre estados y entre límites, y en varios casos es histórica.</li>
            <li>Los tres criterios de cada eje pesan lo mismo.</li>
            <li>El método se revisará cuando cambie la evidencia o cuando se valide con los equipos de las universidades y los actores regionales.</li>
          </ul>

          <h3>Referencias</h3>
          <ul className="small">
            <li>Conservation Measures Partnership (2020). <em>Estándares Abiertos para la Práctica de la Conservación</em>, versión 4.0. <a href="https://conservationstandards.org/about/" target="_blank" rel="noopener noreferrer">conservationstandards.org</a></li>
            <li>Salafsky, N. et al. (2008). A standard lexicon for biodiversity conservation: unified classifications of threats and actions. <em>Conservation Biology</em> 22(4):897–911. <a href="https://doi.org/10.1111/j.1523-1739.2008.00937.x" target="_blank" rel="noopener noreferrer">doi:10.1111/j.1523-1739.2008.00937.x</a></li>
            <li>Häyhä, T., Lucas, P. L., van Vuuren, D. P., Cornell, S. E. y Hoff, H. (2016). From Planetary Boundaries to national fair shares of the global safe operating space — How can the scales be bridged? <em>Global Environmental Change</em> 40:60–72. <a href="https://doi.org/10.1016/j.gloenvcha.2016.06.008" target="_blank" rel="noopener noreferrer">doi:10.1016/j.gloenvcha.2016.06.008</a></li>
            <li>Huang, I. B., Keisler, J. y Linkov, I. (2011). Multi-criteria decision analysis in environmental sciences: ten years of applications and trends. <em>Science of the Total Environment</em> 409(19):3578–3594. <a href="https://doi.org/10.1016/j.scitotenv.2011.06.022" target="_blank" rel="noopener noreferrer">doi:10.1016/j.scitotenv.2011.06.022</a></li>
            <li>OCDE y JRC (2008). <em>Handbook on Constructing Composite Indicators: Methodology and User Guide</em>. <a href="https://doi.org/10.1787/9789264043466-en" target="_blank" rel="noopener noreferrer">doi:10.1787/9789264043466-en</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
