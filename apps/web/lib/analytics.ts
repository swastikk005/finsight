import { prisma } from "./db"

export const categorizeTransaction = (description: string) => {
  const desc = description.toLowerCase()
  if (desc.includes("zomato") || desc.includes("swiggy") || desc.includes("restaurant") || desc.includes("food")) return "Food & Dining"
  if (desc.includes("uber") || desc.includes("ola") || desc.includes("petrol") || desc.includes("fuel")) return "Travel"
  if (desc.includes("amazon") || desc.includes("flipkart") || desc.includes("myntra") || desc.includes("shopping")) return "Shopping"
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("youtube") || desc.includes("entertainment")) return "Subscription"
  if (desc.includes("rent") || desc.includes("electricity") || desc.includes("water") || desc.includes("bill")) return "Bills & Utilities"
  if (desc.includes("salary") || desc.includes("stipend") || desc.includes("bonus")) return "Salary"
  return "Others"
}

function calculateHealthScore(totalIncome: number, totalExpense: number, savingsRate: number, transCount: number, baseIncome: number = 0) {
  if (transCount === 0 && baseIncome === 0) return 0
  
  const effectiveIncome = Math.max(totalIncome, baseIncome)
  let score = 0
  
  // Savings Rate (up to 40 pts)
  const effectiveNet = effectiveIncome - totalExpense
  const effectiveSavingsRate = effectiveIncome > 0 ? (effectiveNet / effectiveIncome) * 100 : 0
  score += Math.min(40, (Math.max(0, effectiveSavingsRate) / 50) * 40)
  
  // Net Cash Flow (up to 30 pts)
  if (effectiveIncome > totalExpense) score += 30
  else if (effectiveIncome === totalExpense && effectiveIncome > 0) score += 15
  
  // Expense Ratio (up to 20 pts)
  const ratio = effectiveIncome > 0 ? (totalExpense / effectiveIncome) : 1
  if (ratio < 0.3) score += 20
  else if (ratio < 0.6) score += 10
  
  // Active Management (up to 10 pts)
  score += Math.min(10, (transCount / 10) * 10)
  
  return Math.round(score)
}

function findSubscriptions(transactions: any[]) {
  const subs: Record<string, { amount: number; count: number; name: string }> = {}
  const keywords = ["netflix", "spotify", "amazon", "youtube", "cloud", "apple", "google", "prime", "finedge", "gym"]

  for (const t of transactions) {
    const desc = (t.description || "").toLowerCase()
    const isSub = keywords.some(k => desc.includes(k))
    
    if (isSub) {
      if (!subs[desc]) subs[desc] = { amount: Math.abs(t.amount), count: 0, name: t.description }
      subs[desc].count++
    }
  }

  return Object.values(subs).filter(s => s.count >= 1)
}

function calculateAdvancedMetrics(transactions: any[], totalIncome: number, totalExpense: number, baseIncome: number = 0) {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysRemaining = daysInMonth - now.getDate()
  
  const effectiveIncome = Math.max(totalIncome, baseIncome)
  const remainingBudget = Math.max(0, effectiveIncome - totalExpense)
  const safeDailySpend = daysRemaining > 0 ? (remainingBudget / daysRemaining) : 0
  const avgDailySpend = transactions.length > 0 ? (totalExpense / now.getDate()) : 0
  const daysUntilBurnout = avgDailySpend > 0 ? Math.round(remainingBudget / avgDailySpend) : 30

  const spikes = transactions
    .filter(t => t.type === 'expense' && Math.abs(t.amount) > (avgDailySpend * 3))
    .map(t => ({ description: t.description, amount: Math.abs(t.amount) }))

  return { safeDailySpend, daysUntilBurnout, spikes }
}

export async function getUserAnalytics(userId: string) {
  const user = await (prisma as any).user.findUnique({ 
    where: { id: userId }, 
    select: { monthlyIncome: true, currency: true } 
  })
  
  const txns = await (prisma as any).transaction.findMany({ 
    where: { userId }, 
    orderBy: { date: "asc" } 
  })

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

  let totalIncome = 0
  let totalExpense = 0
  let lastMonthIncome = 0
  let lastMonthExpense = 0

  const monthly: Record<string, { income: number; expense: number }> = {}
  const categoryTotals: Record<string, number> = {}

  for (const item of txns) {
    const t = item as any
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

    if (!monthly[key]) monthly[key] = { income: 0, expense: 0 }

    const isIncome = t.type === "income" || (!t.type && t.amount > 0)
    if (isIncome) {
      monthly[key].income += Math.abs(t.amount)
    } else {
      monthly[key].expense += Math.abs(t.amount)
    }

    const cat = t.category || "Other"
    if (!isIncome) {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount)
    }

    if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
      if (isIncome) totalIncome += Math.abs(t.amount)
      else totalExpense += Math.abs(t.amount)
    }

    if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) {
      if (isIncome) lastMonthIncome += Math.abs(t.amount)
      else lastMonthExpense += Math.abs(t.amount)
    }
  }

  const net = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? ((net / totalIncome) * 100) : 0
  const expenseChangePct = lastMonthExpense > 0
    ? (((totalExpense - lastMonthExpense) / lastMonthExpense) * 100)
    : 0

  const monthlyArray = Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({ month, ...data }))

  const categoryArray = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const healthScore = calculateHealthScore(totalIncome, totalExpense, savingsRate, txns.length, user?.monthlyIncome || 0)
  const subscriptions = findSubscriptions(txns)
  const { safeDailySpend, daysUntilBurnout, spikes } = calculateAdvancedMetrics(
    txns, 
    totalIncome, 
    totalExpense, 
    user?.monthlyIncome || 0
  )

  return {
    totalIncome,
    totalExpense,
    net,
    savingsRate,
    expenseChangePct,
    healthScore,
    subscriptions,
    safeDailySpend,
    daysUntilBurnout,
    spikes,
    totalTransactions: txns.length,
    monthly: monthlyArray,
    categories: categoryArray,
    recentTransactions: txns.slice(-10).reverse()
  }
}
