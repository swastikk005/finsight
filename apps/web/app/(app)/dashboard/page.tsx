import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getUserAnalytics } from "@/lib/analytics"
// No local icons needed anymore
import { StatsCard } from "@/components/dashboard/stats-card"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { HealthScoreCard } from "@/components/dashboard/health-score-card"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { DiagnosticsPanel } from "@/components/dashboard/diagnostics-panel"
import { formatCurrency } from "@/lib/utils"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return null

  const stats = await getUserAnalytics(user.id)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">FinSight Executive Overview</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium italic">
          Good morning, {user.name?.split(" ")[0] ?? "there"} — Here is your real-time financial diagnostic.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Income"
          value={stats.totalIncome}
          isCurrency
          icon="income"
          iconColor="text-green-400"
          index={0}
          currency={user.currency || "INR"}
        />
        <StatsCard
          title="Monthly Expense"
          value={stats.totalExpense}
          isCurrency
          change={stats.expenseChangePct}
          icon="expense"
          iconColor="text-red-400"
          index={1}
          currency={user.currency || "INR"}
        />
        <StatsCard
          title="Net Balance"
          value={stats.net}
          isCurrency
          icon="net"
          iconColor={stats.net >= 0 ? "text-emerald-600" : "text-orange-600"}
          index={2}
          currency={user.currency || "INR"}
        />
        <StatsCard
          title="Savings Rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          icon="savings"
          iconColor="text-teal-600"
          index={3}
        />
      </div>

      {/* Diagnostics: Burn Rate & Safe Spend */}
      <DiagnosticsPanel
        safeDailySpend={stats.safeDailySpend}
        daysUntilBurnout={stats.daysUntilBurnout}
        spikes={stats.spikes}
        totalExpense={stats.totalExpense}
        totalBalance={stats.net}
      />

      {/* Main Grid: 2/3 Left, 1/3 Right */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left: Charts & AI */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-slate-200 border rounded-2xl p-1 shadow-sm overflow-hidden">
            <SpendingChart data={stats.monthly} />
          </div>
          <AIInsightsPanel />
        </div>

        {/* Right: Intelligence & Categories */}
        <div className="space-y-6">
          <HealthScoreCard score={stats.healthScore} />
          <SubscriptionCard subscriptions={stats.subscriptions} />
          <CategoryChart data={stats.categories} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={stats.recentTransactions.map((t: any) => ({
          ...t,
          date: t.date.toISOString(),
        }))}
      />
    </div>
  )
}
