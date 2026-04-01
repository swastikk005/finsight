import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { PieChart, Plus, Sparkles, TrendingDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIGenerateButton } from "@/components/budgets/ai-generate-button"
import { formatCurrency, cn } from "@/lib/utils"

export default async function BudgetsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        include: { budgets: true, transactions: true }
    })
    if (!user) return null

    // Simple current spending calculation per category
    const spendingByCategory = user.transactions.reduce((acc: any, t) => {
        if (t.type === 'expense') {
            const cat = t.category || 'Others'
            acc[cat] = (acc[cat] || 0) + (Math.abs(t.amount))
        }
        return acc
    }, {})

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Budgets</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Control your spending with AI-optimized category limits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <AIGenerateButton />
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <Plus className="h-4 w-4" />
                        New Budget
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.budgets.length === 0 ? (
                    <Card className="lg:col-span-3 border-dashed border-slate-200 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 shadow-sm">
                                <PieChart className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No budgets active</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-2 mb-8 font-medium">
                                Use AI Generate to automatically create budgets based on your last 30 days of spending.
                            </p>
                            <AIGenerateButton />
                        </CardContent>
                    </Card>
                ) : (
                    user.budgets.map((budget) => {
                        const currentSpent = spendingByCategory[budget.category] || 0
                        const progress = Math.min(100, Math.round((currentSpent / budget.amount) * 100))
                        const isOver = currentSpent > budget.amount

                        return (
                        return (
                            <Card key={budget.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                                <CardHeader className="pb-2 border-b border-slate-50 mb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">{budget.category}</CardTitle>
                                        {isOver ? (
                                            <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                                                <AlertCircle className="h-3 w-3" />
                                                <span className="text-[10px] uppercase font-black tracking-widest">Over Limit</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                {100 - progress}% Left
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="space-y-5">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Spent</p>
                                                <p className={cn("text-xl font-black tabular-nums", isOver ? "text-orange-600" : "text-slate-900")}>
                                                    {formatCurrency(currentSpent)}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Limit</p>
                                                <p className="text-sm font-bold text-slate-500 tabular-nums">{formatCurrency(budget.amount)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000", isOver ? "bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.3)]" : "bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]")} 
                                                style={{ width: `${progress}%` }} 
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                            {isOver 
                                                ? `Reduce your ${budget.category} spending to stay on track this month.` 
                                                : `You're doing great! Keep your daily spending under ${formatCurrency((budget.amount - currentSpent) / 15)}.`
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
