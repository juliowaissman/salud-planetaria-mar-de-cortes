import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

// Tema del sitio, derivado del logo del Corredor. Paleta categórica validada
// (separación para daltonismo y contraste ≥ 3:1 sobre blanco). Orden fijo.
export const CHART = {
  palette: ['#2a64a8', '#cc6c26', '#1a9aad', '#9b4f95'],
  ink: '#14212e',
  muted: '#4a5866',
  faint: '#6b7884',
  grid: '#e3e8ec',
  axis: '#c3ced6',
  font: '"Source Sans 3", -apple-system, "Segoe UI", Roboto, sans-serif',
}

const axisCommon = {
  axisLine: { lineStyle: { color: CHART.axis } },
  axisTick: { lineStyle: { color: CHART.axis } },
  axisLabel: { color: CHART.muted },
  nameTextStyle: { color: CHART.faint },
  splitLine: { lineStyle: { color: CHART.grid } },
}

echarts.registerTheme('mdc', {
  color: CHART.palette,
  backgroundColor: 'transparent',
  textStyle: { fontFamily: CHART.font, color: CHART.ink },
  legend: { textStyle: { color: CHART.muted }, icon: 'roundRect', itemWidth: 14, itemHeight: 8 },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: CHART.axis,
    borderWidth: 1,
    textStyle: { color: CHART.ink, fontFamily: CHART.font },
    extraCssText: 'box-shadow: 0 4px 14px rgba(10,58,102,0.14); border-radius: 8px;',
  },
  categoryAxis: { ...axisCommon, splitLine: { show: false } },
  valueAxis: { ...axisCommon, axisLine: { show: false }, axisTick: { show: false } },
  line: { symbolSize: 7, lineStyle: { width: 2 } },
  bar: { itemStyle: { borderRadius: [4, 4, 0, 0] } },
})

type Props = {
  option: echarts.EChartsOption
  height?: number
  className?: string
  ariaLabel?: string
}

export default function EChart({ option, height = 320, className, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current, 'mdc', { renderer: 'canvas' })
    chartRef.current = chart
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => {
      ro.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, true)
    // El canvas no se redibuja solo cuando llega la fuente web: repintar al cargarla
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) chartRef.current?.setOption(option, true)
    })
    return () => {
      alive = false
    }
  }, [option])

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height }}
    />
  )
}
