import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import EChart, { CHART } from '../lib/EChart'
import type { SpotlightChart } from '../types'

const fmt = (v: number | null) => (v == null ? 'n/d' : v.toLocaleString('es-MX'))

export default function SpotlightChartView({ chart, height = 320 }: { chart: SpotlightChart; height?: number }) {
  const option = useMemo<EChartsOption>(() => {
    const multi = chart.series.length > 1
    const horizontal = chart.type === 'hbar'
    const catAxis = {
      type: 'category' as const,
      data: chart.categories,
      axisLabel: horizontal
        ? { width: 150, overflow: 'break' as const, lineHeight: 14 }
        : { interval: 0, width: 90, overflow: 'break' as const, lineHeight: 14 },
      inverse: horizontal,
    }
    const valAxis = {
      type: 'value' as const,
      name: horizontal ? undefined : chart.unit,
      nameTextStyle: { align: 'left' as const },
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: chart.type === 'line' ? 'line' : 'shadow' },
        valueFormatter: (v: any) => `${fmt(v as number | null)} ${chart.unit}`,
      },
      legend: { bottom: 0, show: multi },
      grid: horizontal
        ? { left: 160, right: 56, top: 10, bottom: multi ? 40 : 24 }
        : { left: 56, right: 20, top: 34, bottom: multi ? 64 : 44 },
      xAxis: horizontal ? valAxis : catAxis,
      yAxis: horizontal ? catAxis : valAxis,
      series: chart.series.map((s, i) => ({
        name: s.name,
        type: chart.type === 'line' ? 'line' : 'bar',
        smooth: chart.type === 'line' ? true : undefined,
        connectNulls: true,
        stack: chart.stacked ? 'total' : undefined,
        data: s.values,
        barMaxWidth: horizontal ? 22 : 44,
        itemStyle: {
          color: CHART.palette[i % CHART.palette.length],
          borderRadius: chart.stacked ? 0 : horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          borderColor: '#ffffff',
          borderWidth: chart.stacked ? 1 : 0,
        },
        label: multi
          ? undefined
          : {
              show: true,
              position: horizontal ? 'right' : 'top',
              color: CHART.muted,
              fontSize: 11,
              formatter: (p: any) => fmt(p.value),
            },
      })),
    }
  }, [chart])

  return (
    <>
      <EChart option={option} height={height} ariaLabel={`${chart.title} (${chart.unit})`} />
      <table className="sr-only">
        <caption>{chart.title}</caption>
        <thead>
          <tr><th>Categoría</th>{chart.series.map((s) => <th key={s.name}>{s.name}</th>)}</tr>
        </thead>
        <tbody>
          {chart.categories.map((c, i) => (
            <tr key={c}><td>{c}</td>{chart.series.map((s) => <td key={s.name}>{fmt(s.values[i])} {chart.unit}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
