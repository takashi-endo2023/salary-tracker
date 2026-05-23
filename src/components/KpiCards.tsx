import type { YearlySummary } from '../types'
import { fmt } from '../utils/format'

interface Props {
  years: YearlySummary[]
}

export function KpiCards({ years }: Props) {
  const real = years.filter(d => d.totalGross > 0 && !d.isPartial)
  if (real.length === 0) return null

  const peakGross = real.reduce((a, b) => a.totalGross > b.totalGross ? a : b)
  const peakTakehome = real.reduce((a, b) => a.totalTakehome > b.totalTakehome ? a : b)
  const growth = real.length >= 2
    ? ((real[real.length - 1].totalTakehome - real[0].totalTakehome) / real[0].totalTakehome) * 100
    : null
  const cumulative = real.reduce((s, d) => s + d.totalTakehome, 0)

  return (
    <div className="kpi-grid">
      <div className="kpi-card accent">
        <div className="kpi-label">ピーク年収（総支給）</div>
        <div className="kpi-value">{fmt.man(peakGross.totalGross)}<span className="kpi-unit">万円</span></div>
        <div className="kpi-sub">{peakGross.year}年</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">ピーク手取り</div>
        <div className="kpi-value">{fmt.man(peakTakehome.totalTakehome)}<span className="kpi-unit">万円</span></div>
        <div className="kpi-sub">{peakTakehome.year}年</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">{real[0].year}→{real[real.length - 1].year} 成長率</div>
        <div className="kpi-value">
          {growth !== null ? `+${Math.round(growth)}` : '—'}<span className="kpi-unit">%</span>
        </div>
        <div className="kpi-sub">{real.length}年間の推移</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">累計手取り収入</div>
        <div className="kpi-value">{fmt.man(cumulative)}<span className="kpi-unit">万円</span></div>
        <div className="kpi-sub">{real[0].year}〜{real[real.length - 1].year}年計</div>
      </div>
    </div>
  )
}
