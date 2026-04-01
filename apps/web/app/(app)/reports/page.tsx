"use client"

import { useEffect, useState } from "react"
import { FileText, Download, PieChart, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { downloadCSV } from "@/lib/csv-export"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function ReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/transactions")
            .then(res => res.json())
            .then(d => {
                setData(d.transactions || [])
                setLoading(false)
            })
    }, [])

    const handleExport = () => {
        if (!data || data.length === 0) return
        const exportData = data.map((t: any) => ({
            Date: formatDate(t.date),
            Description: t.description,
            Category: t.category,
            Type: t.type,
            Amount: t.amount,
        }))
        downloadCSV(exportData, `FinSight_Report_${new Date().toISOString().split("T")[0]}.csv`)
    }

    const income = data?.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + t.amount, 0) || 0
    const expense = data?.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + t.amount, 0) || 0

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
                    <p className="text-slate-500 text-sm mt-0.5 font-medium italic">Summary of your monthly performance and transaction history.</p>
                </div>
                <Button onClick={handleExport} variant="gradient" className="gap-2">
                    <Download className="h-4 w-4" /> Export CSV
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                    <CardHeader className="pb-2 border-b border-slate-50 mb-2">
                        <CardTitle className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-emerald-600 tabular-nums">{formatCurrency(income)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                    <CardHeader className="pb-2 border-b border-slate-50 mb-2">
                        <CardTitle className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Expense</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-red-600 tabular-nums">{formatCurrency(expense)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                    <CardHeader className="pb-2 border-b border-slate-50 mb-2">
                        <CardTitle className="text-[10px] uppercase font-black tracking-widest text-slate-400">Net Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-indigo-600 tabular-nums">{formatCurrency(income - expense)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 mb-4 bg-slate-50/50">
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Transaction Summary</CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">All records currently in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="h-40 bg-slate-50 animate-pulse rounded-2xl" />
                        ) : data?.length === 0 ? (
                            <p className="text-center py-10 text-slate-300 italic font-medium">No data to report.</p>
                        ) : (
                            <div className="border border-slate-100 rounded-2xl overflow-hidden text-sm shadow-inner">
                                <div className="bg-slate-50 grid grid-cols-4 px-6 py-3 font-black text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                    <div>Date</div>
                                    <div>Category</div>
                                    <div className="text-right">Type</div>
                                    <div className="text-right">Amount</div>
                                </div>
                                {data.slice(0, 15).map((t: any, i: number) => (
                                    <div key={i} className="grid grid-cols-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <div className="text-slate-500 font-medium">{formatDate(t.date)}</div>
                                        <div className="text-slate-900 font-black">{t.category}</div>
                                        <div className={`text-right font-black text-[10px] uppercase tracking-tighter ${t.type === "income" ? "text-emerald-600/70" : "text-red-600/70"}`}>
                                            {t.type.toUpperCase()}
                                        </div>
                                        <div className="text-right font-black text-slate-900 tabular-nums">{formatCurrency(t.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
