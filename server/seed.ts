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
  { year: 2015, months: 12, salaryGross: 2640000, salaryTakehome: 2100000, bonusGross:  440000, bonusTakehome:  352000, bonusMonths: [6, 12] },
  { year: 2016, months: 12, salaryGross: 2880000, salaryTakehome: 2280000, bonusGross:  480000, bonusTakehome:  384000, bonusMonths: [6, 12] },
  { year: 2017, months: 12, salaryGross: 3120000, salaryTakehome: 2460000, bonusGross:  600000, bonusTakehome:  480000, bonusMonths: [6, 12] },
  { year: 2018, months: 12, salaryGross: 3480000, salaryTakehome: 2736000, bonusGross:  700000, bonusTakehome:  560000, bonusMonths: [6, 12] },
  { year: 2019, months: 12, salaryGross: 3840000, salaryTakehome: 3000000, bonusGross:  800000, bonusTakehome:  640000, bonusMonths: [6, 12] },
  { year: 2020, months: 12, salaryGross: 3600000, salaryTakehome: 2820000, bonusGross:  560000, bonusTakehome:  448000, bonusMonths: [6, 12] },
  { year: 2021, months: 12, salaryGross: 3960000, salaryTakehome: 3096000, bonusGross:  700000, bonusTakehome:  560000, bonusMonths: [6, 12] },
  { year: 2022, months: 12, salaryGross: 4320000, salaryTakehome: 3360000, bonusGross:  840000, bonusTakehome:  672000, bonusMonths: [6, 12] },
  { year: 2023, months: 12, salaryGross: 4680000, salaryTakehome: 3624000, bonusGross: 1000000, bonusTakehome:  800000, bonusMonths: [6, 12] },
  { year: 2024, months: 12, salaryGross: 5040000, salaryTakehome: 3888000, bonusGross: 1160000, bonusTakehome:  928000, bonusMonths: [6, 12] },
  { year: 2025, months: 12, salaryGross: 5400000, salaryTakehome: 4152000, bonusGross: 1260000, bonusTakehome: 1008000, bonusMonths: [6, 12] },
  { year: 2026, months: 5,  salaryGross: 2400000, salaryTakehome: 1840000, bonusGross:       0, bonusTakehome:       0, bonusMonths: [] },
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
