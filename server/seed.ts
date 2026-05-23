// 年次データ → 月次レコードに変換してシード
// 給与は月数で均等割り、ボーナスは夏(6月)/冬(12月)に半々振り分け
// ボーナスが1回分の年は12月のみ

interface YearlyInput {
  year: number
  months: number        // 働いた月数
  salaryGross: number   // 給与総支給（年間）
  salaryTakehome: number
  bonusGross: number    // ボーナス総支給
  bonusTakehome: number
  bonusMonths: number[] // ボーナス支給月
}

const YEARLY: YearlyInput[] = [
  { year: 2018, months:  9, salaryGross: 1665000, salaryTakehome: 1323000, bonusGross:  360000, bonusTakehome:  288000, bonusMonths: [6, 12] },
  { year: 2019, months: 12, salaryGross: 2340000, salaryTakehome: 1860000, bonusGross:  420000, bonusTakehome:  336000, bonusMonths: [6, 12] },
  { year: 2020, months: 12, salaryGross: 2520000, salaryTakehome: 1992000, bonusGross:  380000, bonusTakehome:  304000, bonusMonths: [6, 12] },
  { year: 2021, months: 12, salaryGross: 4080000, salaryTakehome: 3180000, bonusGross:  760000, bonusTakehome:  608000, bonusMonths: [6, 12] },
  { year: 2022, months: 12, salaryGross: 4380000, salaryTakehome: 3396000, bonusGross:  860000, bonusTakehome:  688000, bonusMonths: [6, 12] },
  { year: 2023, months: 12, salaryGross: 4740000, salaryTakehome: 3660000, bonusGross:  980000, bonusTakehome:  784000, bonusMonths: [6, 12] },
  { year: 2024, months: 12, salaryGross: 5160000, salaryTakehome: 3972000, bonusGross: 1100000, bonusTakehome:  880000, bonusMonths: [6, 12] },
  { year: 2025, months: 12, salaryGross: 5580000, salaryTakehome: 4284000, bonusGross: 1220000, bonusTakehome:  976000, bonusMonths: [6, 12] },
  { year: 2026, months:  5, salaryGross: 2500000, salaryTakehome: 1915000, bonusGross:       0, bonusTakehome:       0, bonusMonths: [] },
]

export function buildMonthly(y: YearlyInput) {
  const monthlySalaryGross = Math.round(y.salaryGross / y.months)
  const monthlySalaryTakehome = Math.round(y.salaryTakehome / y.months)
  const bonusPerMonth = y.bonusMonths.length > 0 ? Math.round(y.bonusGross / y.bonusMonths.length) : 0
  const bonusTakehomePerMonth = y.bonusMonths.length > 0 ? Math.round(y.bonusTakehome / y.bonusMonths.length) : 0

  const records = []
  for (let m = 1; m <= y.months; m++) {
    const isBonus = y.bonusMonths.includes(m)
    records.push({
      year: y.year,
      month: m,
      salary_gross: monthlySalaryGross,
      salary_takehome: monthlySalaryTakehome,
      bonus_gross: isBonus ? bonusPerMonth : 0,
      bonus_takehome: isBonus ? bonusTakehomePerMonth : 0,
      memo: '',
    })
  }
  return records
}

export { YEARLY }
