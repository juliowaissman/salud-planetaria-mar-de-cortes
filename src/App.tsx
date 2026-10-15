import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Boundaries from './pages/Boundaries'
import BoundaryDetail from './pages/BoundaryDetail'
import Spotlights from './pages/Spotlights'
import Prioritization from './pages/Prioritization'
import Sources from './pages/Sources'
import About from './pages/About'

function NotFound() {
  return (
    <div className="container section">
      <h1>Página no encontrada</h1>
      <p className="muted page-intro">
        La dirección solicitada no existe en este sitio.
      </p>
      <p>
        <Link to="/">Volver al inicio</Link> · <Link to="/limites">Ver los límites planetarios</Link>
      </p>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/limites" element={<Boundaries />} />
          <Route path="/limites/:id" element={<BoundaryDetail />} />
          <Route path="/spotlights" element={<Spotlights />} />
          <Route path="/spotlights/:id" element={<Spotlights />} />
          <Route path="/priorizacion" element={<Prioritization />} />
          <Route path="/fuentes" element={<Sources />} />
          <Route path="/acerca" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
