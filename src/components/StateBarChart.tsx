import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import EChart, { CHART } from '../lib/EChart'
import { catalog } from '../data'
import type { StateValue } from '../types'

const name = (id: string) => catalog.states.find((s) => s.id === id)?.name ?? id

export default function StateBarChart({ values, unit, height = 300 }: { values: StateValue[]; unit?: string; height?: number }) {
  const option = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params
          const sv = values[p.dataIndex]
          const extra = sv?.note ? `<br/><span style="color:${CHART.muted}">${sv.note}</span>` : ''
          return `${p.name}: ${p.value ?? 'n/d'}${extra}`
        },
      },
      grid: { left: 52, right: 20, top: 36, bottom: 70 },
      xAxis: {
        type: 'category',
        data: values.map((v) => name(v.stateId)),
        axisLabel: { rotate: 30, fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        name: unit ?? '',
      },
      series: [
        {
          type: 'bar',
          data: values.map((v) => ({ value: v.value, itemStyle: { color: CHART.palette[0] } })),
          barMaxWidth: 56,
          label: { show: true, position: 'top', color: CHART.muted, formatter: (p: any) => (p.value == null ? 'n/d' : p.value) },
        },
      ],
    }
  }, [values, unit])

  return (
    <>
      <EChart option={option} height={height} ariaLabel={`Comparación por estado del Mar de Cortés (${unit ?? ''})`} />
      <ul className="sr-only">
        {values.map((v) => (
          <li key={v.stateId}>
            {name(v.stateId)}: {v.value == null ? 'sin dato' : `${v.value.toLocaleString('es-MX')} ${unit ?? ''}`}
          </li>
        ))}
      </ul>
    </>
  )
}
