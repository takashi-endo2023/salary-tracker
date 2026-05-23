import { useState } from 'react'
import type { YearlySummary, MonthlyRecord } from '../types'
import { fmt } from '../utils/format'

interface Props {
  years: YearlySummary[]
  isDemo: boolean
  onEdit: (record: MonthlyRecord) => void
  onDelete: (year: number, month: number) => void
  onAdd: () => void
}

const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

export function DataTable({ years, isDemo, onEdit, onDelete, onAdd }: Props) {
  const rows = years.filter(d => d.totalGross > 0)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (year: number) =>
    setExpanded(prev => { const n = new Set(prev); n.has(year) ? n.delete(year) : n.add(year); return n })

  const maxGross = Math.max(...rows.filter(r => !r.isPartial).map(r => r.totalGross))
  const colCount = isDemo ? 7 : 8

  return (
    <div className="table-card">
      <div className="table-header">
        <span className="table-title">年別・月別データ</span>
        {!isDemo && <span className="table-hint">年をクリックで月別展開</span>}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="left">年 / 月</th>
              <th>給与総支給</th>
              <th>ボーナス</th>
              <th>合計（総支給）</th>
              <th>手取り合計</th>
              <th>手取率</th>
              <th>前年比</th>
              {!isDemo && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(d => {
              const isExpanded = expanded.has(d.year)
              const salaryGrossTotal = d.months.reduce((s, m) => s + m.salaryGross, 0)
              const bonusGrossTotal = d.months.reduce((s, m) => s + m.bonusGross, 0)
              return (
                <>
                  <tr
                    key={d.year}
                    className={`year-row${d.isPartial ? ' partial' : ''}`}
                    onClick={() => toggle(d.year)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="left year-cell">
                      <span className="expand-icon">{isExpanded ? '▾' : '▸'}</span>
                      {d.year}年
                      {d.isPartial && <span className="badge-partial">途中</span>}
                      {!d.isPartial && d.totalGross === maxGross && (
                        <span className="badge-peak">PEAK</span>
                      )}
                    </td>
                    <td>{fmt.yen(salaryGrossTotal)}</td>
                    <td>{bonusGrossTotal > 0 ? fmt.yen(bonusGrossTotal) : '—'}</td>
                    <td className="strong">{fmt.yen(d.totalGross)}</td>
                    <td className="takehome">{fmt.yen(d.totalTakehome)}</td>
                    <td className="muted">{fmt.pct(d.takehomeRate)}</td>
                    <td className={d.yoyTakehome === null ? 'muted' : d.yoyTakehome >= 0 ? 'up' : 'down'}>
                      {fmt.yoy(d.yoyTakehome)}
                    </td>
                    {!isDemo && <td />}
                  </tr>
                  {isExpanded && d.months.map(m => {
                    const monthlyTotal = m.salaryGross + m.bonusGross
                    const monthlyTakehome = m.salaryTakehome + m.bonusTakehome
                    const rate = monthlyTotal > 0 ? monthlyTakehome / monthlyTotal : 0
                    return (
                      <tr key={`${m.year}-${m.month}`} className="month-row">
                        <td className="left month-cell">{MONTH_NAMES[m.month - 1]}</td>
                        <td className="muted">{fmt.yen(m.salaryGross)}</td>
                        <td className="muted">{m.bonusGross > 0 ? fmt.yen(m.bonusGross) : '—'}</td>
                        <td>{fmt.yen(monthlyTotal)}</td>
                        <td className="takehome">{fmt.yen(monthlyTakehome)}</td>
                        <td className="muted">{fmt.pct(rate)}</td>
                        <td />
                        {!isDemo && (
                          <td className="action-cell">
                            <button
                              className="btn-edit"
                              aria-label="編集"
                              onClick={e => { e.stopPropagation(); onEdit(m) }}
                            >✎</button>
                            <button
                              className="btn-delete"
                              aria-label="削除"
                              onClick={e => {
                                e.stopPropagation()
                                if (confirm(`${m.year}年${m.month}月のデータを削除しますか？`)) {
                                  onDelete(m.year, m.month)
                                }
                              }}
                            >×</button>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </>
              )
            })}
            {!isDemo && (
              <tr className="add-row" onClick={onAdd}>
                <td colSpan={colCount}>
                  <span className="add-row-inner">
                    <span className="add-row-icon">＋</span>
                    月次データを追加
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
