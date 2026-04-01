"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Transaction {
    id: string
    date: string | Date
    description: string
    amount: number
    type: string
    category?: string | null
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
    const exportToCSV = () => {
        const headers = ["Date", "Description", "Category", "Amount", "Type"]
        const csvRows = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.description.replace(/,/g, ""), // Remove commas to prevent CSV breakage
            t.category || "Uncategorized",
            Math.abs(t.amount).toString(),
            t.type
        ])
        
        const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `FinSight_Transactions_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 mb-2">
                <CardTitle className="text-lg font-bold text-slate-900">Recent Transactions</CardTitle>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportToCSV}
                    className="gap-2 text-xs border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm"
                >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                        No transactions yet. Add your first one!
                    </div>
                ) : (
                    <div className="space-y-1">
                        {transactions.map((txn, i) => {
                            const isIncome = txn.type === "income" || txn.amount > 0
                            return (
                                <motion.div
                                    key={txn.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isIncome ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
                                        {isIncome
                                            ? <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                                            : <ArrowDownLeft className="h-5 w-5 text-red-600" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{txn.description}</p>
                                        <p className="text-[11px] font-medium text-slate-400">{formatDate(txn.date)}</p>
                                    </div>
                                    {txn.category && (
                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold shrink-0 hidden sm:flex bg-slate-100 text-slate-600 border-none px-2 py-0.5">{txn.category}</Badge>
                                    )}
                                    <p className={`text-sm font-black shrink-0 tabular-nums ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                                        {isIncome ? "+" : "-"}{formatCurrency(Math.abs(txn.amount))}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
