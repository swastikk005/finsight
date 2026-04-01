"use client"

import { motion } from "framer-motion"
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { TransactionDialog } from "./transaction-dialog"

interface Transaction {
    id: string
    date: string
    description: string
    amount: number
    type: string
    category: string
}

interface TransactionTableProps {
    transactions: Transaction[]
    onRefresh: () => void
}

export function TransactionTable({ transactions, onRefresh }: TransactionTableProps) {
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this transaction?")) return

        try {
            const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
            onRefresh()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="bg-white border-slate-200 border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/7">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-slate-300 italic font-medium">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn, i) => {
                                const isIncome = txn.type === "income" || txn.amount > 0
                                return (
                                    <motion.tr
                                        key={txn.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium tabular-nums">{formatDate(txn.date)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
                                                    {isIncome ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <ArrowDownLeft className="h-4 w-4 text-red-600" />}
                                                </div>
                                                <span className="text-sm font-black text-slate-900 truncate max-w-[200px]">{txn.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-slate-400">
                                            {txn.category}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-black text-right tabular-nums ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                                            {isIncome ? "+" : "-"}{formatCurrency(Math.abs(txn.amount))}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TransactionDialog
                                                    onSuccess={onRefresh}
                                                    initialData={{
                                                        ...txn,
                                                        date: new Date(txn.date).toISOString().split("T")[0]
                                                    }}
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    }
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(txn.id)}
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
