import { useState, useEffect } from 'react'
import type { MonthlyRecord } from '../types'

interface Props {
  initial?: MonthlyRecord | null
  onSave: (record: MonthlyRecord) => void
  onClose: () => void
}

const EMPTY: MonthlyRecord = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  salaryGross: 0,
  salaryTakehome: 0,
  bonusGross: 0,
  bonusTakehome: 0,
  memo: '',
}

export function EditModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<MonthlyRecord>(initial ?? EMPTY)

  useEffect(() => {
    setForm(initial ?? EMPTY)
  }, [initial])

  const set = (key: keyof MonthlyRecord, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  const monthlyTotal = form.salaryGross + form.bonusGross
  const monthlyTakehome = form.salaryTakehome + form.bonusTakehome

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? `${initial.year}年${initial.month}月 編集` : '月次データを追加'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>年</label>
              <input
                type="number"
                value={form.year}
                onChange={e => set('year', Number(e.target.value))}
                min={2000}
                max={2099}
                required
              />
            </div>
            <div className="form-group">
              <label>月</label>
              <select
                value={form.month}
                onChange={e => set('month', Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}月</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>給与総支給（月・円）</label>
              <input
                type="number"
                value={form.salaryGross || ''}
                onChange={e => set('salaryGross', Number(e.target.value))}
                min={0}
                placeholder="例: 350000"
              />
            </div>
            <div className="form-group">
              <label>給与手取り（月・円）</label>
              <input
                type="number"
                value={form.salaryTakehome || ''}
                onChange={e => set('salaryTakehome', Number(e.target.value))}
                min={0}
                placeholder="例: 270000"
              />
            </div>

            <div className="form-group">
              <label>ボーナス総支給（円）</label>
              <input
                type="number"
                value={form.bonusGross || ''}
                onChange={e => set('bonusGross', Number(e.target.value))}
                min={0}
                placeholder="例: 500000"
              />
            </div>
            <div className="form-group">
              <label>ボーナス手取り（円）</label>
              <input
                type="number"
                value={form.bonusTakehome || ''}
                onChange={e => set('bonusTakehome', Number(e.target.value))}
                min={0}
                placeholder="例: 400000"
              />
            </div>

            <div className="form-group span2">
              <label>メモ</label>
              <input
                type="text"
                value={form.memo ?? ''}
                onChange={e => set('memo', e.target.value)}
                placeholder="転職、ボーナス支給月など"
                maxLength={100}
              />
            </div>
          </div>

          <div className="form-preview">
            <span>月収合計（総支給）</span>
            <strong>{monthlyTotal.toLocaleString('ja-JP')}円</strong>
            <span>手取り合計</span>
            <strong>{monthlyTakehome.toLocaleString('ja-JP')}円</strong>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  )
}
