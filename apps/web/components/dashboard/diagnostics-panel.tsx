"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Zap, Calendar, TrendingUp, DollarSign, ShieldCheck } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface DiagnosticsPanelProps {
    safeDailySpend: number
    daysUntilBurnout: number
    spikes: { description: string; amount: number }[]
    totalExpense: number
    totalBalance: number
}

export function DiagnosticsPanel({ safeDailySpend, daysUntilBurnout, spikes, totalExpense, totalBalance }: DiagnosticsPanelProps) {
    const emergencyTarget = totalExpense * 6
    const emergencyProgress = Math.min(100, Math.round(((totalBalance || 0) / (emergencyTarget || 1)) * 100))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Safe Daily Spend */}
            <Card className="glass relative overflow-hidden group shadow-sm bg-white border-slate-200">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="h-12 w-12 text-emerald-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Safe Daily Spend</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{formatCurrency(safeDailySpend)}</h3>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] text-emerald-600 font-medium">Auto-calculated daily limit</p>
                    </div>
                </CardContent>
            </Card>

            {/* Salary Burnout */}
            <Card className="glass relative overflow-hidden group shadow-sm bg-white border-slate-200">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar className="h-12 w-12 text-teal-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Salary Runway</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{daysUntilBurnout} Days</h3>
                    <div className="flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-teal-600" />
                        <p className="text-[10px] text-teal-600 font-medium">Estimated until zero balance</p>
                    </div>
                </CardContent>
            </Card>

            {/* Unexpected Spikes / Alerts */}
            <Card className="glass relative overflow-hidden group shadow-sm bg-white border-slate-200">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle className="h-12 w-12 text-orange-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Anomalies Detected</p>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {spikes.length > 0 ? `${spikes.length} Spikes` : "None"}
                    </h3>
                    {spikes.length > 0 ? (
                        <p className="text-[10px] text-orange-600 font-medium truncate">
                            {spikes[0].description}: {formatCurrency(spikes[0].amount)}
                        </p>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <p className="text-[10px] text-emerald-600 font-medium">Spending is stable</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Emergency Fund */}
            <Card className="glass relative overflow-hidden group shadow-sm bg-white border-slate-200">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="h-12 w-12 text-emerald-600" />
                </div>
                <CardContent className="p-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Emergency Fund</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{emergencyProgress}%</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-emerald-600 h-full transition-all duration-1000" 
                            style={{ width: `${emergencyProgress}%` }} 
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Target: {formatCurrency(emergencyTarget)} (6mo)</p>
                </CardContent>
            </Card>
        </div>
    )
}
