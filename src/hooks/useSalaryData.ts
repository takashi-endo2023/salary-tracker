import { useState, useEffect, useCallback } from 'react'
import type { MonthlyRecord, YearlySummary } from '../types'
import { MOCK_DATA } from '../data/mockData'

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export function aggregateYears(records: MonthlyRecord[]): YearlySummary[] {
  const byYear = new Map<number, MonthlyRecord[]>()
  for (const r of records) {
    if (!byYear.has(r.year)) byYear.set(r.year, [])
    byYear.get(r.year)!.push(r)
  }

  const currentYear = new Date().getFullYear()
  const summaries = [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, months]) => {
      const totalGross = months.reduce((s, m) => s + m.salaryGross + m.bonusGross, 0)
      const totalTakehome = months.reduce((s, m) => s + m.salaryTakehome + m.bonusTakehome, 0)
      return { year, totalGross, totalTakehome, takehomeRate: totalGross > 0 ? totalTakehome / totalGross : 0, months, isPartial: year === currentYear, yoyGross: null as number | null, yoyTakehome: null as number | null }
    })

  for (let i = 1; i < summaries.length; i++) {
    const prev = summaries[i - 1]
    summaries[i].yoyGross = prev.totalGross > 0 ? (summaries[i].totalGross - prev.totalGross) / prev.totalGross : null
    summaries[i].yoyTakehome = prev.totalTakehome > 0 ? (summaries[i].totalTakehome - prev.totalTakehome) / prev.totalTakehome : null
  }

  return summaries
}

async function apiGet(): Promise<MonthlyRecord[]> {
  const res = await fetch('/api')
  return res.json() as Promise<MonthlyRecord[]>
}

async function apiUpsert(record: MonthlyRecord): Promise<void> {
  await fetch('/api', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) })
}

async function apiDelete(year: number, month: number): Promise<void> {
  await fetch(`/api/${year}/${month}`, { method: 'DELETE' })
}

export function useSalaryData() {
  const [records, setRecords] = useState<MonthlyRecord[]>(IS_DEMO ? MOCK_DATA : [])
  const [loading, setLoading] = useState(!IS_DEMO)

  useEffect(() => {
    if (IS_DEMO) return
    apiGet().then(data => { setRecords(data); setLoading(false) })
  }, [])

  const years = aggregateYears(records)

  const upsert = useCallback(async (record: MonthlyRecord) => {
    if (IS_DEMO) return
    await apiUpsert(record)
    setRecords(prev => {
      const exists = prev.some(r => r.year === record.year && r.month === record.month)
      return exists
        ? prev.map(r => r.year === record.year && r.month === record.month ? record : r)
        : [...prev, record]
    })
  }, [])

  const remove = useCallback(async (year: number, month: number) => {
    if (IS_DEMO) return
    await apiDelete(year, month)
    setRecords(prev => prev.filter(r => !(r.year === year && r.month === month)))
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `salary-data-${new Date().getFullYear()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [records])

  const importJson = useCallback((file: File) => {
    if (IS_DEMO) return
    const reader = new FileReader()
    reader.onload = async e => {
      try {
        const imported = JSON.parse(e.target?.result as string) as MonthlyRecord[]
        for (const r of imported) await apiUpsert(r)
        setRecords(await apiGet())
      } catch {
        alert('JSONの形式が正しくありません')
      }
    }
    reader.readAsText(file)
  }, [])

  return { records, years, isDemo: IS_DEMO, loading, upsert, remove, exportJson, importJson }
}
