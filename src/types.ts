export interface MonthlyRecord {
  year: number
  month: number
  salaryGross: number
  salaryTakehome: number
  bonusGross: number
  bonusTakehome: number
  memo?: string
}

export interface YearlySummary {
  year: number
  totalGross: number
  totalTakehome: number
  takehomeRate: number
  yoyGross: number | null
  yoyTakehome: number | null
  isPartial: boolean
  months: MonthlyRecord[]
}
