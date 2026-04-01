"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ElementType> = {
    positive: CheckCircle,
    warning: AlertTriangle,
    trending: TrendingUp,
    default: Sparkles,
}

const colorMap: Record<string, string> = {
    positive: "text-emerald-700 bg-emerald-50 border border-emerald-100",
    warning: "text-orange-700 bg-orange-50 border border-orange-100",
    trending: "text-teal-700 bg-teal-50 border border-teal-100",
    default: "text-emerald-700 bg-emerald-50 border border-emerald-100",
}

interface Insight {
    type: string
    title: string
    description: string
}

export function AIInsightsPanel() {
    const [insights, setInsights] = useState<Insight[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchInsights = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/ai-insights")
            if (!res.ok) throw new Error("Failed to fetch insights")
            const data = await res.json()
            setInsights(data.insights || [])
        } catch (e: any) {
            setError(e.message || "Could not load AI insights")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchInsights() }, [])

    return (
        <Card className="col-span-full border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">AI Financial Insights</CardTitle>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Machine Learning Analysis</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchInsights} disabled={loading} className="text-slate-400 hover:text-slate-900">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-6 text-center">
                        <p className="text-slate-400 text-sm">{error}</p>
                        <p className="text-slate-300 text-xs mt-1">Make sure your OPENAI_API_KEY is configured in .env</p>
                    </div>
                ) : insights.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-6">Add some transactions to get AI insights.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {insights.map((insight, i) => {
                            const type = insight.type || "default"
                            const Icon = iconMap[type] || Sparkles
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:border-emerald-500/20 transition-all duration-500 group"
                                >
                                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-5 shadow-sm ${colorMap[type] || colorMap.default}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-sm font-black text-slate-900 mb-2 tracking-tight">{insight.title}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{insight.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
