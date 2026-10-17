import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { MapSpec, MapTooltipBar } from '../types'
import { stateById } from '../data'

const stateName = (id: string) => stateById.get(id)?.name ?? id.toUpperCase()

const TARGET = ['bc', 'bcs', 'son', 'sin', 'nay']
const GRAY = '#e3e8ec'

// Basemaps vectoriales gratuitos, sin API key (OpenFreeMap).
// Estilo por defecto configurable en build con VITE_BASEMAP_STYLE (positron|bright|liberty).
//
// ALTERNATIVA con CARTO (API key gratuita, registro en https://carto.com/basemaps/apikey/):
//   añade aquí una entrada con la URL de estilo CARTO y el token, p. ej.
//   { id: 'carto', name: 'CARTO', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json?access_token=TU_TOKEN' }
//   (se recomienda inyectar el token vía import.meta.env.VITE_CARTO_TOKEN en lugar de hardcodearlo).
const BASEMAPS = [
  { id: 'positron', name: 'Claro', url: 'https://tiles.openfreemap.org/styles/positron' },
  { id: 'bright', name: 'Color', url: 'https://tiles.openfreemap.org/styles/bright' },
  { id: 'liberty', name: 'OSM', url: 'https://tiles.openfreemap.org/styles/liberty' },
]

// Respaldo: raster legacy de CARTO (sin API key). Solo se usa si el vectorial no carga.
const FALLBACK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    basemap: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap © CARTO',
    },
  },
  layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }],
}

function hex(ratio: number): string {
  // rampa secuencial de un solo tono: azul claro (#d6e6f2) → navy del logo (#0a3a66)
  const r = Math.round(214 + (10 - 214) * ratio)
  const g = Math.round(230 + (58 - 230) * ratio)
  const b = Math.round(242 + (102 - 242) * ratio)
  return `rgb(${r},${g},${b})`
}

function colorScale(valuesByState: Record<string, number | null>) {
  const nums = TARGET.map((id) => valuesByState[id]).filter((v): v is number => v != null)
  if (nums.length === 0) return () => GRAY
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const span = max - min || 1
  return (id: string): string => {
    const v = valuesByState[id]
    if (v == null) return GRAY
    return hex((v - min) / span)
  }
}

function miniBarsHtml(bars: MapTooltipBar[]): string {
  const max = Math.max(...bars.map((b) => Math.abs(b.value ?? 0)), 0.01)
  const cols = bars
    .map((b) => {
      const v = b.value ?? 0
      const h = Math.max(4, Math.round((Math.abs(v) / max) * 40))
      // par apto para daltonismo: turquesa (positivo) / naranja (negativo)
      const color = v >= 0 ? '#1a9aad' : '#cc6c26'
      return (
        `<div class="mb-col">` +
        `<span class="mb-val">${v >= 0 ? '+' : ''}${v.toFixed(1)}%</span>` +
        `<span class="mb-bar" style="height:${h}px;background:${color}"></span>` +
        `<span class="mb-label">${b.label}</span></div>`
      )
    })
    .join('')
  return `<div class="mb-row">${cols}</div>`
}

async function resolveStyle(id: string): Promise<{ style: string | maplibregl.StyleSpecification; attribution: string }> {
  const bm = BASEMAPS.find((b) => b.id === id)
  if (!bm) return { style: FALLBACK_STYLE, attribution: '© OpenStreetMap © CARTO' }
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 5000)
    const r = await fetch(bm.url, { signal: ctrl.signal })
    clearTimeout(t)
    if (r.ok) return { style: bm.url, attribution: '© OpenFreeMap © OpenStreetMap contributors' }
  } catch {
    // fall through to raster fallback
  }
  return { style: FALLBACK_STYLE, attribution: '© OpenStreetMap © CARTO' }
}

function walkCoords(geometry: any, out: [number, number][]) {
  if (!geometry) return
  const { type, coordinates } = geometry
  if (type === 'Point') out.push(coordinates as [number, number])
  else if (type === 'LineString') (coordinates as [number, number][]).forEach((c) => out.push(c))
  else if (type === 'Polygon' || type === 'MultiLineString')
    (coordinates as [number, number][][]).forEach((ring) => ring.forEach((c) => out.push(c)))
  else if (type === 'MultiPolygon')
    (coordinates as [number, number][][][]).forEach((poly) => poly.forEach((ring) => ring.forEach((c) => out.push(c))))
  else if (Array.isArray(coordinates)) (coordinates as any[]).forEach((c) => walkCoords(c, out))
}

export default function StateChoropleth({ map, height = 430 }: { map: MapSpec; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [failed, setFailed] = useState(false) // WebGL no disponible
  const [styleId, setStyleId] = useState(() => import.meta.env.VITE_BASEMAP_STYLE || 'positron')

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false
    let m: maplibregl.Map | null = null

    const addLayers = (geo: any, color: (id: string) => string) => {
      m!.addSource('states', { type: 'geojson', data: geo })
      m!.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'states',
        paint: {
          'fill-color': [
            'match',
            ['get', 'id'],
            'bc', color('bc'),
            'bcs', color('bcs'),
            'son', color('son'),
            'sin', color('sin'),
            'nay', color('nay'),
            GRAY,
          ],
          'fill-opacity': 0.72,
        },
      })
      m!.addLayer({
        id: 'states-line',
        type: 'line',
        source: 'states',
        paint: { 'line-color': '#ffffff', 'line-width': 1.2, 'line-opacity': 0.9 },
      })

      // Encuadre a los 5 estados (o a todo el país si falla el filtro)
      const target = geo.features.filter((f: any) => TARGET.includes(f.properties?.id))
      const use = target.length ? target : geo.features
      const coords: [number, number][] = []
      use.forEach((f: any) => walkCoords(f.geometry, coords))
      if (coords.length) {
        const bounds = new maplibregl.LngLatBounds()
        coords.forEach((c) => bounds.extend(c))
        m!.fitBounds(bounds, { padding: 40, maxZoom: 7 })
      }

      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 })
      m!.on('mousemove', 'states-fill', (e) => {
        m!.getCanvas().style.cursor = 'pointer'
        const feat = e.features?.[0]
        if (!feat) return
        const name = feat.properties?.name
        const id = feat.properties?.id
        const v = id ? map.valuesByState[id] : null
        let html = `<strong>${name}</strong><br/>${v == null ? 'Sin dato' : `${v.toLocaleString('es-MX')} ${map.unit ?? ''}`}`
        const bars = id ? map.tooltip?.barsByState?.[id] : undefined
        if (bars && bars.length > 0) {
          html += `<br/><span class="mb-title">${map.tooltip?.label ?? 'Cambio %'}</span>${miniBarsHtml(bars)}`
        }
        popup.setLngLat(e.lngLat).setHTML(html).addTo(m!)
      })
      m!.on('mouseleave', 'states-fill', () => {
        m!.getCanvas().style.cursor = ''
        popup.remove()
      })
    }

    const run = async () => {
      const resolved = await resolveStyle(styleId)
      if (cancelled) return
      try {
        m = new maplibregl.Map({
          container: containerRef.current!,
          style: resolved.style,
          attributionControl: false,
        })
      } catch (err) {
        console.error('MapLibre no disponible (WebGL)', err)
        setFailed(true)
        return
      }
      mapRef.current = m
      m.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right')
      m.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: resolved.attribution }), 'bottom-right')

      const whenLoaded = new Promise<void>((res) => {
        if (m!.loaded()) res()
        else m!.once('load', () => res())
      })

      try {
        const base = import.meta.env.BASE_URL
        const geo = await (await fetch(`${base}geo/states.json`)).json()
        if (cancelled) return
        await whenLoaded
        if (cancelled) return
        addLayers(geo, colorScale(map.valuesByState))
      } catch (err) {
        console.error('Error cargando GeoJSON', err)
      }
    }

    run()

    return () => {
      cancelled = true
      m?.remove()
      mapRef.current = null
    }
  }, [map, styleId])

  return (
    <figure style={{ margin: 0 }}>
      <div className="map-style-switch" role="group" aria-label="Estilo del mapa base">
        {BASEMAPS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={styleId === b.id ? 'on' : ''}
            aria-pressed={styleId === b.id}
            onClick={() => setStyleId(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>
      {failed ? (
        <div className="note">
          Mapa interactivo no disponible en este navegador (requiere WebGL). Datos por estado:{' '}
          {TARGET.map((id) => {
            const v = map.valuesByState[id]
            return v == null ? null : `${id.toUpperCase()} ${v}${map.unit ? ` ${map.unit}` : ''}`
          })
            .filter(Boolean)
            .join(' · ')}
        </div>
      ) : (
        <div ref={containerRef} className="map-wrap" style={{ width: '100%', height }} aria-label={`Mapa: ${map.title}`} role="img" />
      )}
      <figcaption className="small muted" style={{ marginTop: 8 }}>
        {map.title}. Límites estatales: Natural Earth (dominio público). Mapa base: OpenFreeMap / OpenStreetMap.
        {map.note ? ` ${map.note}` : ''}
      </figcaption>
      <table className="map-values">
        <tbody>
          {TARGET.map((id) => {
            const v = map.valuesByState[id]
            return (
              <tr key={id}>
                <th scope="row">{stateName(id)}</th>
                <td>{v == null ? 'Sin dato' : `${v.toLocaleString('es-MX')}${map.unit ? ` ${map.unit}` : ''}`}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </figure>
  )
}
