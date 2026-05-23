import { useState, useRef } from 'react'
import { useSalaryData } from './hooks/useSalaryData'
import { KpiCards } from './components/KpiCards'
import { IncomeChart } from './components/IncomeChart'
import { DataTable } from './components/DataTable'
import { EditModal } from './components/EditModal'
import type { MonthlyRecord } from './types'

export function App() {
  const { years, isDemo, loading, upsert, remove, exportJson, importJson } = useSalaryData()
  const [editing, setEditing] = useState<MonthlyRecord | null | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleEdit = (record: MonthlyRecord) => setEditing(record)
  const handleDelete = (year: number, month: number) => remove(year, month)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) importJson(file)
    e.target.value = ''
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <div className="header-label">Personal Finance</div>
            <h1 className="header-title">年収トラッカー</h1>
          </div>
          <div className="header-actions">
            {isDemo && (
              <span className="demo-badge">DEMO</span>
            )}
            {!isDemo && (
              <>
                <button className="btn-outline btn-sm" onClick={exportJson}>エクスポート</button>
                <button className="btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                  インポート
                </button>
                <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
                <button className="btn-primary btn-sm" onClick={() => setEditing(null)}>+ 追加</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && <div className="loading">データを読み込み中...</div>}
        <KpiCards years={years} />
        <IncomeChart years={years} />
        <DataTable
          years={years}
          isDemo={isDemo}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
          onSave={upsert}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}
