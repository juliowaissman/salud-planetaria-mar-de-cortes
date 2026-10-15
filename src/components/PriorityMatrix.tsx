import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import EChart from '../lib/EChart'
import { catalog } from '../data'
import type { Rating } from '../types'
import { priorityOf } from '../lib/priority'

const R: Record<Rating, number> = { Alto: 3, Medio: 2, Bajo: 1 }
// Rampa teal propia para prioridad (distinta del verde/ámbar/rojo de estado)
const COLOR: Record<string, string> = { Alta: '#2f5749', Media: '#4a7a6a', Baja: '#8fb3a3' }

// Etiquetas cortas para que no se encimen en la matriz; el nombre completo va en el tooltip y la leyenda.
const SHORT: Record<string, string> = {
  'climate-change': 'Clima',
  'biosphere-integrity': 'Biosfera',
  'land-system-change': 'Uso de suelo',
  'freshwater-change': 'Agua dulce',
  'biogeochemical-flows': 'Flujos N/P',
  'ocean-acidification': 'Acidificación',
  aerosols: 'Aerosoles',
  ozone: 'Ozono',
  'novel-entities': 'Entidades nuevas',
}

const AXIS: Record<number, string> = { 1: 'Bajo', 2: 'Medio', 3: 'Alto' }

export default function PriorityMatrix({ height = 460 }: { height?: number }) {
  const option = useMemo<EChartsOption>(() => {
    const data = catalog.boundaries.map((b, i) => {
      const x = R[b.regional.leverage]
      const y = R[b.regional.impact]
      // pequeño desplazamiento determinista para separar puntos coincidentes
      const jx = ((i % 3) - 1) * 0.08
      const jy = ((i % 2) === 0 ? 1 : -1) * 0.06
      const pr = priorityOf(b.regional.impact, b.regional.leverage)
      return {
        name: b.name,
        short: SHORT[b.id] ?? b.name,
        impact: b.regional.impact,
        leverage: b.regional.leverage,
        priority: pr,
        value: [x + jx, y + jy],
        itemStyle: { color: COLOR[pr] },
        symbolSize: 16,
      }
    })
    return {
      grid: { left: 52, right: 84, top: 36, bottom: 62 },
      tooltip: {
        trigger: 'item',
        formatter: (p: any) =>
          `<strong>${p.data.name}</strong><br/>Impacto regional: ${p.data.impact}<br/>Apalancamiento: ${p.data.leverage}<br/>Prioridad: ${p.data.priority}`,
      },
      xAxis: {
        name: 'Apalancamiento regional →',
        nameLocation: 'middle',
        nameGap: 32,
        min: 0.5,
        max: 3.5,
        interval: 1,
        axisLabel: { formatter: (v: number) => AXIS[v] ?? '', color: '#5a6b7a' },
        splitLine: { lineStyle: { color: '#e6ecf2' } },
      },
      yAxis: {
        name: 'Impacto regional →',
        nameLocation: 'middle',
        nameGap: 40,
        min: 0.5,
        max: 3.5,
        interval: 1,
        axisLabel: { formatter: (v: number) => AXIS[v] ?? '', color: '#5a6b7a' },
        splitLine: { lineStyle: { color: '#e6ecf2' } },
      },
      series: [
        {
          type: 'scatter',
          data,
          label: {
            show: true,
            formatter: (p: any) => p.data.short,
            position: 'right',
            distance: 5,
            fontSize: 11,
            color: '#14242f',
          },
          labelLayout: { hideOverlap: true },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#c3cfda', type: 'dashed' },
            label: { show: false },
            data: [{ xAxis: 2 }, { yAxis: 2 }],
          },
        },
      ],
    }
  }, [])

  return (
    <div>
      <EChart
        option={option}
        height={height}
        ariaLabel="Matriz de priorización: impacto regional frente a apalancamiento regional de cada límite planetario"
      />
      <div className="pb-legend">
        <span><i className="lg-priority-high" />Prioridad alta (actuar aquí)</span>
        <span><i className="lg-priority-mid" />Prioridad media</span>
        <span><i className="lg-priority-low" />Prioridad baja</span>
      </div>
      <p className="small muted" style={{ marginTop: 6, lineHeight: 1.7 }}>
        <strong>Etiquetas:</strong>{' '}
        {catalog.boundaries.map((b) => `${SHORT[b.id] ?? b.name} = ${b.name}`).join(' · ')}
      </p>
    </div>
  )
}
