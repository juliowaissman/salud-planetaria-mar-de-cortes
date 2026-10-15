import { catalog } from '../data'
import { SourceList } from '../components/SourceList'

export default function Sources() {
  const global = catalog.sources.filter((s) => s.group === 'global')
  const regional = catalog.sources.filter((s) => s.group === 'regional')
  return (
    <div className="container section">
      <h1>Fuentes</h1>
      <p className="muted page-intro">
        El estado global de los límites planetarios proviene del <strong>Planetary Health Check 2026</strong> (Potsdam
        Institute for Climate Impact Research / PBScience). Las fuentes regionales consultadas para los análisis del Mar de
        Cortés se listan a continuación con su URL y fecha de acceso.
      </p>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Reportes globales (Planetary Health Check)</h2>
        <SourceList items={global} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Fuentes regionales</h2>
        <SourceList items={regional} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Notas metodológicas</h2>
        <div className="prose">
          <ul>
            <li>Los valores globales y la clasificación de riesgo (seguro / riesgo creciente / alto riesgo) se citan del Planetary Health Check 2026.</li>
            <li>La regionalización a los 5 estados del Mar de Cortés usa fuentes oficiales (INEGI, CONAGUA, CONABIO, CONAFOR, CONANP, CONAPESCA, SMN, INECC, SEMARNAT) e internacionales (NOAA, FAO, Global Forest Watch, NASA, entre otras).</li>
            <li>Cuando no existe un dato estatal directo para una variable global, se usa el proxy espacial más próximo y se marca la limitación.</li>
            <li>Las fechas de acceso permiten reproducir la consulta de datos; las series se actualizan editando los archivos JSON en <code>src/data/regional/</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
