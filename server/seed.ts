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
  { year: 2015, months: 12, salaryGross: 1800000, salaryTakehome: 1460171, bonusGross: 0,       bonusTakehome: 0,       bonusMonths: [] },
  { year: 2016, months: 12, salaryGross: 1704000, salaryTakehome: 1320000, bonusGross: 10000,   bonusTakehome: 8000,    bonusMonths: [12] },
  { year: 2017, months: 12, salaryGross: 2040000, salaryTakehome: 1680000, bonusGross: 40000,   bonusTakehome: 32000,   bonusMonths: [12] },
  { year: 2018, months: 12, salaryGross: 2400000, salaryTakehome: 1900000, bonusGross: 445000,  bonusTakehome: 404000,  bonusMonths: [6, 12] },
  { year: 2019, months: 12, salaryGross: 2840000, salaryTakehome: 2250000, bonusGross: 705000,  bonusTakehome: 590000,  bonusMonths: [6, 12] },
  { year: 2020, months: 12, salaryGross: 2760000, salaryTakehome: 2179945, bonusGross: 241000,  bonusTakehome: 210000,  bonusMonths: [12] },
  { year: 2021, months: 12, salaryGross: 1354620, salaryTakehome: 1134608, bonusGross: 337201,  bonusTakehome: 237201,  bonusMonths: [6, 12] },
  { year: 2022, months: 12, salaryGross: 1906475, salaryTakehome: 1672673, bonusGross: 0,       bonusTakehome: 0,       bonusMonths: [] },
  { year: 2023, months: 12, salaryGross: 3603681, salaryTakehome: 3119549, bonusGross: 1075495, bonusTakehome: 955192,  bonusMonths: [6, 12] },
  { year: 2024, months: 12, salaryGross: 4254462, salaryTakehome: 3570980, bonusGross: 1845494, bonusTakehome: 1625488, bonusMonths: [6, 12] },
  { year: 2025, months: 12, salaryGross: 4023645, salaryTakehome: 3165767, bonusGross: 2622624, bonusTakehome: 2124046, bonusMonths: [6, 12] },
  { year: 2026, months: 5,  salaryGross: 1740232, salaryTakehome: 1365083, bonusGross: 0,       bonusTakehome: 0,       bonusMonths: [] },
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
