export interface MonthlyDataPoint {
    month: string
    income: number
    expense: number
}

export interface PredictionPoint {
    month: string
    income: number
    expense: number
    predicted: boolean
}

function linearRegression(data: number[]): { slope: number; intercept: number } {
    const n = data.length
    if (n === 0) return { slope: 0, intercept: 0 }
    const xMean = (n - 1) / 2
    const yMean = data.reduce((a, b) => a + b, 0) / n
    let num = 0
    let den = 0
    for (let i = 0; i < n; i++) {
        num += (i - xMean) * (data[i] - yMean)
        den += (i - xMean) ** 2
    }
    const slope = den === 0 ? 0 : num / den
    const intercept = yMean - slope * xMean
    return { slope, intercept }
}

function addMonths(base: Date, n: number): string {
    const d = new Date(base)
    d.setMonth(d.getMonth() + n)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function generatePredictions(
    historical: MonthlyDataPoint[],
    forecastMonths = 3
): PredictionPoint[] {
    const incomes = historical.map((d) => d.income)
    const expenses = historical.map((d) => d.expense)

    const incomeReg = linearRegression(incomes)
    const expenseReg = linearRegression(expenses)

    const result: PredictionPoint[] = historical.map((d) => ({ ...d, predicted: false }))

    const lastMonth = historical.length > 0
        ? new Date(historical[historical.length - 1].month + "-01")
        : new Date()

    for (let i = 1; i <= forecastMonths; i++) {
        const idx = historical.length - 1 + i
        result.push({
            month: addMonths(lastMonth, i),
            income: Math.max(0, incomeReg.slope * idx + incomeReg.intercept),
            expense: Math.max(0, expenseReg.slope * idx + expenseReg.intercept),
            predicted: true,
        })
    }

    return result
}
