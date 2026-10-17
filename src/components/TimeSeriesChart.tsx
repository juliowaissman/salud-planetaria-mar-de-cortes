import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import EChart from '../lib/EChart'
import type { Series } from '../types'

export default function TimeSeriesChart({ series, height = 300 }: { series: Series[]; height?: number }) {
  const option = useMemo<EChartsOption>(() => {
    // union of all labels so multiple series align even with different x ranges
    const cats = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.label))))
    const valueAt = (s: Series, label: string) => s.points.find((p) => p.label === label)?.value ?? null
    return {
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, show: series.length > 1 },
      // Etiquetas en dos líneas (con \n) necesitan más espacio sobre la leyenda
      grid: { left: 52, right: 20, top: 30, bottom: (series.length > 1 ? 46 : 30) + (cats.some((c) => c.includes('\n')) ? 18 : 0) },
      xAxis: { type: 'category', data: cats },
      yAxis: {
        type: 'value',
        name: series[0]?.unit ?? '',
      },
      series: series.map((s) => ({
        name: s.title,
        type: s.kind === 'bar' ? 'bar' : 'line',
        smooth: s.kind === 'bar' ? undefined : true,
        connectNulls: true,
        data: cats.map((c) => valueAt(s, c)),
        lineStyle: { width: 2 },
        symbolSize: 7,
        barMaxWidth: 40,
      })),
    }
  }, [series])

  return (
    <>
      <EChart
        option={option}
        height={height}
        ariaLabel={series.map((s) => s.title).join(', ')}
      />
      <div className="sr-only">
        {series.map((s) => (
          <p key={s.id}>
            {s.title}:{' '}
            {s.points
              .map((p) => `${p.label} ${p.value == null ? 'sin dato' : p.value}`)
              .join('; ')}
          </p>
        ))}
      </div>
    </>
  )
}
