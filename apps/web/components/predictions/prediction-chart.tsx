"use client"

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface PredictionPoint {
    month: string
    income: number
    expense: number
    predicted: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        const isPredicted = payload[0]?.payload?.predicted
        return (
            <div className="bg-white border-slate-200 border p-4 rounded-xl shadow-2xl backdrop-blur-sm bg-white/90">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">
                    {label} {isPredicted ? "(Predicted)" : ""}
                </p>
                <div className="space-y-1">
                    <p className="text-sm font-black text-emerald-600 flex justify-between gap-4 tabular-nums">
                        <span>Income</span>
                        <span>{formatCurrency(payload[0].value)}</span>
                    </p>
                    <p className="text-sm font-black text-red-600 flex justify-between gap-4 tabular-nums">
                        <span>Expense</span>
                        <span>{formatCurrency(payload[1].value)}</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export function PredictionChart({ data }: { data: PredictionPoint[] }) {
    if (data.length === 0) return <div className="h-full flex items-center justify-center text-white/30 italic">No prediction data available.</div>
    
    const predictionStartIndex = data.findIndex(p => p.predicted)
    const historicalData = predictionStartIndex !== -1 ? data.slice(0, predictionStartIndex + 1) : data
    const predictedData = predictionStartIndex !== -1 ? data.slice(predictionStartIndex) : []

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                    dataKey="month"
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.split("-").join("/")}
                />
                <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
                <Legend
                    wrapperStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "30px" }}
                    formatter={(value) => <span className="text-slate-500">{value}</span>}
                />

                {/* Historical Bars */}
                <Bar dataKey="income" name="Income" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} opacity={0.1} />
                <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={32} opacity={0.1} />

                {/* Historical Lines */}
                <Line
                    type="monotone"
                    data={historicalData}
                    dataKey="income"
                    stroke="#059669"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                    name="Income (History)"
                />
                <Line
                    type="monotone"
                    data={historicalData}
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                    name="Expense (History)"
                />

                {/* Prediction Lines */}
                <Line
                    type="monotone"
                    data={predictedData}
                    dataKey="income"
                    stroke="#059669"
                    strokeWidth={3}
                    strokeDasharray="8 8"
                    dot={false}
                    activeDot={false}
                    name="Income (AI Forecast)"
                />
                <Line
                    type="monotone"
                    data={predictedData}
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    strokeDasharray="8 8"
                    dot={false}
                    activeDot={false}
                    name="Expense (AI Forecast)"
                />
            </ComposedChart>
        </ResponsiveContainer>
    )
}
