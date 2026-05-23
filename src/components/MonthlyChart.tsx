import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { YearlySummary } from '../types'

interface Props {
  years: YearlySummary[]
}

const BLUE = '#2563eb'
const GREEN = '#34d399'

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const [year, month] = (label ?? '').split('/')
  const salary = payload.find(p => p.dataKey === '給与')?.value ?? 0
  const bonus = payload.find(p => p.dataKey === 'ボーナス')?.value ?? 0
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 150,
    }}>
      <p style={{ fontWeight: 700, marginBottom: 10, color: '#1a202c', fontSize: 13 }}>
        {year}年{Number(month)}月
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 5, fontSize: 12 }}>
        <span style={{ color: '#718096' }}>給与手取り</span>
        <span style={{ fontWeight: 600, color: BLUE }}>{salary}万円</span>
      </div>
      {bonus > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 12 }}>
          <span style={{ color: '#718096' }}>ボーナス</span>
          <span style={{ fontWeight: 600, color: '#059669' }}>{bonus}万円</span>
        </div>
      )}
      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: 16,
        marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9', fontSize: 13,
      }}>
        <span style={{ color: '#718096', fontWeight: 600 }}>合計</span>
        <span style={{ fontWeight: 700, color: '#1a202c' }}>{salary + bonus}万円</span>
      </div>
    </div>
  )
}

function YearTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const value = payload?.value ?? ''
  if (!value.endsWith('/01')) return <g />
  const year = value.split('/')[0]
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={14} textAnchor="middle" fill="#a0aec0" fontSize={11}>{year}</text>
    </g>
  )
}

export function MonthlyChart({ years }: Props) {
  const data = years
    .flatMap(y => y.months)
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(m => ({
      label: `${m.year}/${String(m.month).padStart(2, '0')}`,
      給与: Math.round(m.salaryTakehome / 10000),
      ボーナス: m.bonusTakehome > 0 ? Math.round(m.bonusTakehome / 10000) : 0,
    }))

  if (data.length === 0) return null

  return (
    <div className="chart-card">
      <div className="chart-header-row">
        <div>
          <div className="chart-title">月次収入グラフ</div>
          <div className="chart-subtitle">手取り内訳（万円）— ボーナス月は緑で表示</div>
        </div>
        <div className="chart-legend">
          <span className="legend-dot" style={{ background: BLUE }} />給与
          <span className="legend-dot" style={{ background: GREEN, marginLeft: 12 }} />ボーナス
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={<YearTick />}
            axisLine={false}
            tickLine={false}
            height={28}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#a0aec0', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}万`}
            width={52}
            allowDecimals={false}
            domain={[() => 0, (max: number) => Math.ceil(max / 10) * 10 + 10]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.04)' }} />
          <Bar dataKey="給与" fill={BLUE} fillOpacity={0.75} radius={[2, 2, 0, 0]} stackId="a" />
          <Bar dataKey="ボーナス" fill={GREEN} fillOpacity={0.9} radius={[2, 2, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
