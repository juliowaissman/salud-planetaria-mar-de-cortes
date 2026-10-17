import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import EChart, { CHART } from '../lib/EChart'
import { catalog } from '../data'
import { assess, LEVEL_THRESHOLDS } from '../lib/priority'

// Rampa navy propia para prioridad (distinta del verde/ámbar/rojo de estado); igual a --priority-* en CSS
const COLOR: Record<string, string> = { Alta: '#0a3a66', Media: '#3f7fa6', Baja: '#a9c8da' }

// Posición de la etiqueta cuando dos puntos quedan muy cerca (Agua dulce y Biosfera comparten impacto 4.0)
const LABEL_POS: Record<string, 'top' | 'right' | 'left' | 'bottom'> = { 'freshwater-change': 'top' }

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

export default function PriorityMatrix({ height = 460 }: { height?: number }) {
  const option = useMemo<EChartsOption>(() => {
    const data = catalog.boundaries.flatMap((b) => {
      const a = assess(b)
      if (!a) return []
      return [
        {
          name: b.name,
          short: SHORT[b.id] ?? b.name,
          a,
          value: [a.leverage, a.impact],
          itemStyle: { color: COLOR[a.priority], borderColor: '#ffffff', borderWidth: 2 },
          symbolSize: 18,
          label: { position: LABEL_POS[b.id] ?? 'right' },
        },
      ]
    })
    const axis = (name: string, gap: number) => ({
      name,
      nameLocation: 'middle' as const,
      nameGap: gap,
      min: 1,
      max: 4,
      interval: 1,
      axisLabel: { formatter: (v: number) => String(v) },
      nameTextStyle: { color: CHART.muted, fontWeight: 600 },
    })
    return {
      grid: { left: 56, right: 92, top: 30, bottom: 62 },
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => {
          const a = p.data.a
          return `<strong>${p.data.name}</strong><br/>Impacto regional: ${a.impact.toFixed(2)} (${a.impactLevel})<br/>Apalancamiento: ${a.leverage.toFixed(2)} (${a.leverageLevel})<br/>Prioridad: ${a.priority}${a.robust ? '' : '<br/><em>Clasificación sensible</em>'}`
        },
      },
      xAxis: axis('Apalancamiento regional (1 a 4) →', 32),
      yAxis: axis('Impacto regional (1 a 4) →', 40),
      series: [
        {
          type: 'scatter',
          data,
          label: {
            show: true,
            formatter: (p: any) => p.data.short,
            position: 'right',
            distance: 6,
            fontSize: 11,
            color: CHART.ink,
          },
          labelLayout: { hideOverlap: true },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: CHART.axis, type: 'dashed' },
            label: { show: false },
            data: [
              { xAxis: LEVEL_THRESHOLDS.medio },
              { xAxis: LEVEL_THRESHOLDS.alto },
              { yAxis: LEVEL_THRESHOLDS.medio },
              { yAxis: LEVEL_THRESHOLDS.alto },
            ],
          },
          // Zona de prioridad alta: impacto y apalancamiento ≥ 3
          markArea: {
            silent: true,
            itemStyle: { color: 'rgba(10,58,102,0.07)' },
            label: { show: true, position: 'insideBottomRight', color: CHART.muted, fontSize: 11, fontWeight: 600 },
            data: [[{ name: 'Prioridad alta', xAxis: LEVEL_THRESHOLDS.alto, yAxis: LEVEL_THRESHOLDS.alto }, { xAxis: 4, yAxis: 4 }]],
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
        ariaLabel="Matriz de priorización: impacto regional frente a apalancamiento regional de cada límite planetario, en escala de 1 a 4"
      />
      <div className="pb-legend">
        <span><i className="lg-priority-high" />Prioridad alta</span>
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
