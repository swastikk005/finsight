"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Sparkles, Brain, ArrowDownCircle, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PredictionChart } from "@/components/predictions/prediction-chart"
import { formatCurrency } from "@/lib/utils"

export default function PredictionsPage() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/predictions")
            .then(res => res.json())
            .then(d => {
                setData(d.predictions || [])
                setLoading(false)
            })
    }, [])

    const predictedMonths = data.filter((p: any) => p.predicted)
    const lastPredicted = predictedMonths[predictedMonths.length - 1]

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                    <Brain className="h-7 w-7 text-indigo-600" />
                    Financial Predictions
                </h1>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">Linear regression analysis forecasting your next 3 months.</p>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 mb-4">
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Forecast Overview (Income vs Expense)</CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">Solid lines represent history, dashed lines represent AI forecast.</CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                    {loading ? (
                        <div className="h-full bg-slate-100 animate-pulse rounded-2xl" />
                    ) : (
                        <PredictionChart data={data} />
                    )}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-50 border-slate-100 shadow-inner group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase font-black tracking-widest flex items-center gap-2 text-indigo-600">
                            <Target className="h-4 w-4" /> Final Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black text-slate-900 tabular-nums">{lastPredicted ? lastPredicted.month : "---"}</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Target month for prediction completion.</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-100 shadow-inner group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase font-black tracking-widest flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="h-4 w-4" /> Predicted Surplus
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black text-slate-900 tabular-nums">
                            {lastPredicted ? formatCurrency(lastPredicted.income - lastPredicted.expense) : "---"}
                        </p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Expected net balance in 3 months.</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="h-20 w-20 text-indigo-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase font-black tracking-widest flex items-center gap-2 text-violet-600">
                            <Sparkles className="h-4 w-4" /> AI Note
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                            "Your expenses are trending <span className="text-red-600 font-black">5% higher</span> than your income growth. Consider capping 'Transport' spend to stay in the green."
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
