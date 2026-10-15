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
      legend: { bottom: 0, textStyle: { color: '#5a6b7a' } },
      grid: { left: 52, right: 20, top: 24, bottom: 46 },
      xAxis: { type: 'category', data: cats, axisLabel: { color: '#5a6b7a' } },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#5a6b7a' },
        name: series[0]?.unit ?? '',
        nameTextStyle: { color: '#8594a3' },
        splitLine: { lineStyle: { color: '#e6ecf2' } },
      },
      series: series.map((s) => ({
        name: s.title,
        type: s.kind === 'bar' ? 'bar' : 'line',
        smooth: s.kind === 'bar' ? undefined : true,
        connectNulls: true,
        data: cats.map((c) => valueAt(s, c)),
        lineStyle: { width: 2.5 },
        itemStyle: { color: undefined },
        symbolSize: 6,
        barMaxWidth: 40,
      })),
      color: ['#3f6f5f', '#a05a3c', '#b8721a', '#2f5749', '#b54333', '#8a8272'],
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
