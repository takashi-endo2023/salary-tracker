export const fmt = {
  man: (n: number) => Math.round(n / 10000).toLocaleString('ja-JP'),
  yen: (n: number) => `¥${n.toLocaleString('ja-JP')}`,
  pct: (n: number) => `${(n * 100).toFixed(1)}%`,
  yoy: (n: number | null) => {
    if (n === null) return '—'
    const sign = n >= 0 ? '▲' : '▼'
    return `${sign} ${Math.abs(Math.round(n * 100))}%`
  },
}
