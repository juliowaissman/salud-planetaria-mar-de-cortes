import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import EChart from '../lib/EChart'
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
          const extra = sv?.note ? `<br/><span style="color:#8594a3">${sv.note}</span>` : ''
          return `${p.name}: ${p.value ?? 'n/d'}${extra}`
        },
      },
      grid: { left: 52, right: 20, top: 20, bottom: 70 },
      xAxis: {
        type: 'category',
        data: values.map((v) => name(v.stateId)),
        axisLabel: { color: '#5a6b7a', rotate: 30, fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#5a6b7a' },
        name: unit ?? '',
        nameTextStyle: { color: '#8594a3' },
        splitLine: { lineStyle: { color: '#e6ecf2' } },
      },
      series: [
        {
          type: 'bar',
          data: values.map((v) => ({ value: v.value, itemStyle: { color: '#3f6f5f' } })),
          barMaxWidth: 56,
          label: { show: true, position: 'top', color: '#5a6b7a', formatter: (p: any) => (p.value == null ? 'n/d' : p.value) },
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
