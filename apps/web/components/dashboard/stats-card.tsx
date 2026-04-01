"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, DollarSign, PiggyBank, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: number | string
    isCurrency?: boolean
    change?: number
    icon: "income" | "expense" | "net" | "savings"
    iconColor?: string
    index?: number
    currency?: string
}

const iconMap = {
    income: DollarSign,
    expense: TrendingDown,
    net: PiggyBank,
    savings: CreditCard
}

export function StatsCard({ title, value, isCurrency, change, icon, iconColor = "text-emerald-600", index = 0, currency }: StatsCardProps) {
    const Icon = iconMap[icon]
    const changePositive = (change ?? 0) >= 0
    const ChangeIcon = change === 0 ? Minus : changePositive ? TrendingUp : TrendingDown

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            <Card className="relative overflow-hidden border-slate-200 hover:border-emerald-500/20 transition-all duration-300 group shadow-sm bg-white">
                {/* Subtle shadow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-slate-50/50 rounded-xl" />
                <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">{title}</p>
                        <div className={`h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center`}>
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        {isCurrency ? formatCurrency(typeof value === "number" ? value : parseFloat(String(value)), currency) : value}
                    </p>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${changePositive ? "text-emerald-600" : "text-red-600"}`}>
                            <ChangeIcon className="h-3.5 w-3.5" />
                            <span className="text-slate-500 font-normal">{Math.abs(change).toFixed(1)}% vs last month</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
