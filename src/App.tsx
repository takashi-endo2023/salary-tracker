import { useState } from 'react'
import { useSalaryData } from './hooks/useSalaryData'
import { KpiCards } from './components/KpiCards'
import { IncomeChart } from './components/IncomeChart'
import { MonthlyChart } from './components/MonthlyChart'
import { DataTable } from './components/DataTable'
import { EditModal } from './components/EditModal'
import type { MonthlyRecord } from './types'

export function App() {
  const { records, years, isDemo, loading, upsert, remove } = useSalaryData()
  const [editing, setEditing] = useState<MonthlyRecord | null | undefined>(undefined)

  const handleEdit = (record: MonthlyRecord) => setEditing(record)
  const handleDelete = (year: number, month: number) => remove(year, month)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <div className="header-label">Personal Finance</div>
            <h1 className="header-title">年収トラッカー</h1>
          </div>
          {isDemo && <span className="demo-badge">DEMO</span>}
        </div>
      </header>

      <main className="app-main">
        {loading && <div className="loading">データを読み込み中...</div>}
        <KpiCards years={years} />
        <IncomeChart years={years} />
        <MonthlyChart years={years} />
        <DataTable
          years={years}
          isDemo={isDemo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={() => setEditing(null)}
        />
        {isDemo && (
          <p className="demo-note">
            ※ デモ表示中。実際のデータを入力したい場合はローカルで起動してください。
          </p>
        )}
      </main>

      {editing !== undefined && !isDemo && (
        <EditModal
          initial={editing}
          records={records}
          onSave={upsert}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}
