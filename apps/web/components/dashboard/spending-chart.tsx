"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface DataPoint {
    month: string
    income: number
    expense: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xl text-sm">
                <p className="text-slate-500 mb-2 font-medium">{label}</p>
                {payload.map((entry: any) => (
                    <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
                        {entry.name === "income" ? "Income" : "Expense"}: {formatCurrency(entry.value)}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export function SpendingChart({ data }: { data: DataPoint[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardHeader><CardTitle className="text-slate-900">Monthly Overview</CardTitle></CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-slate-400 text-sm">
                    No transaction data yet. Add some transactions to see your trends.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-900 font-semibold">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <defs>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(0,0,0,0.5)" }} />
                        <Area type="monotone" dataKey="income" name="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
                        <Area type="monotone" dataKey="expense" name="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
