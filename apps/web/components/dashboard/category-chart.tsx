"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_COLORS, formatCurrency } from "@/lib/utils"

interface CategoryData {
    name: string
    value: number
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        const item = payload[0]
        return (
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xl text-sm">
                <p className="font-semibold" style={{ color: item.payload.fill }}>{item.name}</p>
                <p className="text-slate-500">{formatCurrency(item.value)}</p>
            </div>
        )
    }
    return null
}

export function CategoryChart({ data }: { data: CategoryData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader><CardTitle className="text-slate-900 font-semibold">Spending by Category</CardTitle></CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-slate-400 text-sm">
                    No expense data yet.
                </CardContent>
            </Card>
        )
    }

    const chartData = data.slice(0, 8)

    return (
        <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle className="text-slate-900 font-semibold">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={entry.name}
                                    fill={CATEGORY_COLORS[entry.name] || `hsl(${index * 40}, 70%, 60%)`}
                                    opacity={0.9}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            formatter={(value) => <span style={{ color: "rgba(0,0,0,0.5)", fontSize: "11px" }}>{value}</span>}
                            iconSize={8}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
