import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { YearlySummary } from '../types'

interface Props {
  years: YearlySummary[]
}

const BLUE = '#2563eb'
const GREEN = '#059669'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '14px 18px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
      minWidth: 170,
    }}>
      <p style={{ fontWeight: 700, marginBottom: 12, color: '#1a202c', fontSize: 13 }}>{label}年</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 20, marginBottom: 8,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#718096' }}>
            <span style={{
              width: 10, height: 10, borderRadius: 3,
              background: p.color, display: 'inline-block', flexShrink: 0,
            }} />
            {p.dataKey}
          </span>
          <span style={{ fontWeight: 700, fontSize: 14, color: p.color }}>
            {p.value.toLocaleString()}万円
          </span>
        </div>
      ))}
    </div>
  )
}

export function IncomeChart({ years }: Props) {
  const data = years
    .filter(d => d.totalGross > 0)
    .map(d => ({
      year: String(d.year),
      '総支給': Math.round(d.totalGross / 10000),
      '手取り': Math.round(d.totalTakehome / 10000),
    }))

  return (
    <div className="chart-card">
      <div className="chart-header-row">
        <div>
          <div className="chart-title">年収推移グラフ</div>
          <div className="chart-subtitle">総支給 vs 手取り（万円）</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity={0.15} />
              <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="takehomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.2} />
              <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: '#a0aec0', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#a0aec0', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}万`}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#dde3ec', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#718096', paddingTop: 16 }} />
          <Area
            type="monotone"
            dataKey="総支給"
            stroke={BLUE}
            strokeWidth={2}
            fill="url(#grossGrad)"
            dot={false}
            activeDot={{ r: 5, fill: BLUE, strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="手取り"
            stroke={GREEN}
            strokeWidth={2.5}
            fill="url(#takehomeGrad)"
            dot={false}
            activeDot={{ r: 5, fill: GREEN, strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
