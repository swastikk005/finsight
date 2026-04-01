import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CreditCard, Landmark, Plus, AlertCircle, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default async function DebtPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        include: { debts: true }
    })
    if (!user) return null

    const totalDebt = user.debts.reduce((acc, d) => acc + d.amount, 0)

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Debt Management</h1>
                    <p className="text-slate-500 text-sm mt-0.5 font-medium">Track your liabilities and optimize your repayment strategy.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    New Liability
                </Button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Total Liabilities</p>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tabular-nums">{formatCurrency(totalDebt)}</h3>
                        <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 w-fit">
                            <AlertCircle className="h-3 w-3" />
                            <p className="text-[10px] font-black uppercase tracking-tighter">Includes loans and credit cards</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-emerald-50 border-emerald-100 shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mb-1">AI Recommendation</p>
                        <h3 className="text-lg font-black text-emerald-900 mb-1 italic">"Snowball Effect"</h3>
                        <p className="text-[10px] text-emerald-700/70 font-medium leading-relaxed italic">Focus on paying off the smallest balance first for psychological momentum.</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Upcoming Dues</p>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">3</h3>
                        <div className="flex items-center gap-1.5 text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100 w-fit">
                            <Calendar className="h-3 w-3" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Next 7 days</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.debts.length === 0 ? (
                    <Card className="lg:col-span-3 border-dashed border-slate-200 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 shadow-inner">
                                <CreditCard className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No liabilities found</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-2 mb-8 font-medium">
                                Add your credit cards or loans to see a complete picture of your financial health.
                            </p>
                            <Button variant="outline" className="border-slate-200 hover:bg-slate-50 gap-2 font-bold shadow-sm">
                                <Plus className="h-4 w-4" />
                                Add Your First Liability
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    user.debts.map((debt) => (
                        <Card key={debt.id} className="bg-white border-slate-200 shadow-sm group hover:border-orange-500/20 hover:shadow-md transition-all duration-300 overflow-hidden">
                            <CardHeader className="pb-2 border-b border-slate-50 mb-2">
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shadow-sm">
                                        {debt.title.toLowerCase().includes("loan") ? (
                                            <Landmark className="h-6 w-6 text-orange-600" />
                                        ) : (
                                            <CreditCard className="h-6 w-6 text-orange-600" />
                                        )}
                                    </div>
                                    {debt.interestRate && (
                                        <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                                            {debt.interestRate}% APR
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-lg font-black text-slate-900 mt-4 tracking-tight">{debt.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Balance</p>
                                            <p className="text-2xl font-black text-slate-900 tabular-nums">{formatCurrency(debt.amount)}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-black gap-1.5 h-9 px-3 rounded-xl border border-transparent hover:border-emerald-100 transition-all">
                                            Pay
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    {debt.dueDate && (
                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Next Due</span>
                                            <span className="text-[10px] font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
                                                {new Date(debt.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
