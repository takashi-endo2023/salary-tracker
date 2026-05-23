import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { YearlySummary } from '../types'

interface Props {
  years: YearlySummary[]
}

const ACCENT = '#7c6af7'
const ACCENT_LIGHT = '#9d8ffa'

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
      <div className="chart-title">年収推移グラフ</div>
      <div className="chart-subtitle">総支給 vs 手取り（万円）</div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#8892a4', fontSize: 12 }}
            axisLine={{ stroke: '#2a2d3a' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8892a4', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}万`}
            width={52}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1d27',
              border: '1px solid #2a2d3a',
              borderRadius: 8,
              color: '#e2e8f0',
              fontSize: 13,
            }}
            formatter={(v) => [`${v}万円`]}
            labelStyle={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 4 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#8892a4', paddingTop: 12 }}
          />
          <Bar dataKey="総支給" fill={`${ACCENT}55`} stroke={ACCENT} strokeWidth={1} radius={[3, 3, 0, 0]} />
          <Line
            type="monotone"
            dataKey="手取り"
            stroke={ACCENT_LIGHT}
            strokeWidth={2.5}
            dot={{ r: 4, fill: ACCENT_LIGHT, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
