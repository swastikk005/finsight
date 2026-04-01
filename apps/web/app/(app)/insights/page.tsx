import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getUserAnalytics } from "@/lib/analytics"
import { Sparkles, TrendingUp, TrendingDown, Target, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export default async function InsightsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return null

    const stats = await getUserAnalytics(user.id)

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Insights</h1>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">AI-powered analysis of your spending habits and financial health.</p>
            </div>

            <AIInsightsPanel />

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm h-fit overflow-hidden">
                    <CardHeader className="border-b border-slate-50 mb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-900 font-black">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Efficiency Analysis
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium italic">How well you're managing your cash flow.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Savings Rate</p>
                                <p className="text-3xl font-black text-slate-900 tabular-nums">{stats.savingsRate.toFixed(1)}%</p>
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                                <Target className="h-7 w-7 text-emerald-600" />
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                            <div className="flex items-center gap-2 mb-2.5">
                                <Sparkles className="h-4 w-4 text-emerald-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Efficiency Tip</span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                                {stats.savingsRate > 20
                                    ? "Great job! Your savings rate is above the recommended 20%. Consider investing the surplus."
                                    : "Try to aim for a 20% savings rate. Reducing non-essential categories like 'Entertainment' could help."}
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Income</span>
                                <span className="text-emerald-600 font-black tabular-nums">{formatCurrency(stats.totalIncome)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Expenses</span>
                                <span className="text-red-600 font-black tabular-nums">{formatCurrency(stats.totalExpense)}</span>
                            </div>
                            <div className="h-px bg-slate-100 w-full" />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-900 font-black uppercase tracking-tighter text-[10px]">Net Surplus</span>
                                <span className="text-emerald-700 font-black tabular-nums">{formatCurrency(stats.net)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <CategoryChart data={stats.categories} />
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="p-10 flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-emerald-50 via-white to-transparent">
                    <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-200 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform">
                        <Wallet className="h-12 w-12 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ready for a personalized review?</h3>
                        <p className="text-slate-500 font-medium text-sm max-w-xl leading-relaxed italic">
                            Our AI Chat Assistant can analyze specific time periods or categories. Try asking <span className="text-slate-900 font-bold">"Which category did I spend the most on last week?"</span> for deeper insights.
                        </p>
                        <div className="mt-6">
                            <a href="/chat">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 rounded-xl shadow-lg shadow-emerald-100">Go to Chat</Button>
                            </a>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
