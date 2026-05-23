import type { YearlySummary } from '../types'
import { fmt } from '../utils/format'

interface Props {
  years: YearlySummary[]
}

export function calcProjected(years: YearlySummary[]): { value: number; takehome: number; bonusActual: number; monthCount: number } | null {
  const partial = years.find(d => d.isPartial && d.months.length > 0)
  if (!partial) return null
  const lastFull = [...years].filter(d => !d.isPartial && d.totalGross > 0).at(-1)
  const months = partial.months
  const avgGross = months.reduce((s, m) => s + m.salaryGross, 0) / months.length
  const avgTakehome = months.reduce((s, m) => s + m.salaryTakehome, 0) / months.length
  const bonusSoFar = months.reduce((s, m) => s + m.bonusTakehome, 0)
  const bonusGrossSoFar = months.reduce((s, m) => s + m.bonusGross, 0)
  const prevBonusGross = lastFull ? lastFull.months.reduce((s, m) => s + m.bonusGross, 0) : 0
  const prevBonusTakehome = lastFull ? lastFull.months.reduce((s, m) => s + m.bonusTakehome, 0) : 0
  return {
    value: Math.round(avgGross * 12 + Math.max(bonusGrossSoFar, prevBonusGross)),
    takehome: Math.round(avgTakehome * 12 + Math.max(bonusSoFar, prevBonusTakehome)),
    bonusActual: bonusSoFar,
    monthCount: months.length,
  }
}

export function KpiCards({ years }: Props) {
  const real = years.filter(d => d.totalGross > 0 && !d.isPartial)
  if (real.length === 0) return null

  const lastFull = real[real.length - 1]
  const prevFull = real.length >= 2 ? real[real.length - 2] : null
  const cumulative = real.reduce((s, d) => s + d.totalGross, 0)
  const projected = calcProjected(years)
  const yoyBase = projected ? lastFull : prevFull
  const yoyCompare = projected ? projected.value : (lastFull?.totalGross ?? null)
  const yoyDiff = yoyBase && yoyCompare !== null ? yoyCompare - yoyBase.totalGross : null
  const yoyPct = yoyDiff !== null && yoyBase ? Math.round((yoyDiff / yoyBase.totalGross) * 100) : null

  return (
    <div className="kpi-grid">
      <div className="kpi-card accent">
        <div className="kpi-label">前年の年収</div>
        <div className="kpi-value">{fmt.man(lastFull.totalGross)}<span className="kpi-unit">万円</span></div>
        <div className="kpi-sub">{lastFull.year}年 総支給</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">累計年収</div>
        <div className="kpi-value">{fmt.man(cumulative)}<span className="kpi-unit">万円</span></div>
        <div className="kpi-sub">{real[0].year}〜{real[real.length - 1].year}年 総支給計</div>
      </div>
      {projected && (
        <div className="kpi-card projected">
          <div className="kpi-label">今年の予測年収</div>
          <div className="kpi-value">{fmt.man(projected.value)}<span className="kpi-unit">万円</span></div>
          <div className="kpi-sub">
            月給×12{projected.bonusActual > 0 ? ` + ボーナス${fmt.man(projected.bonusActual)}万` : ''}
          </div>
        </div>
      )}
      {yoyDiff !== null && yoyBase && (
        <div className="kpi-card">
          <div className="kpi-label">前年差（年収）</div>
          <div className="kpi-value" style={{ color: yoyDiff >= 0 ? '#059669' : '#e53e3e' }}>
            {yoyDiff >= 0 ? '+' : ''}{fmt.man(yoyDiff)}<span className="kpi-unit">万円</span>
          </div>
          <div className="kpi-sub">
            {yoyBase.year}年比{yoyPct !== null ? `　${yoyPct >= 0 ? '+' : ''}${yoyPct}%` : ''}{projected ? '（予測）' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
