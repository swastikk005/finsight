"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface HealthScoreCardProps {
    score: number
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
    const getColor = (s: number) => {
        if (s >= 80) return "text-emerald-600"
        if (s >= 60) return "text-teal-600"
        if (s >= 40) return "text-orange-600"
        return "text-red-600"
    }

    const getLabel = (s: number) => {
        if (s >= 80) return "Excellent"
        if (s >= 60) return "Good"
        if (s >= 40) return "Fair"
        return "Needs Attention"
    }

    const strokeDasharray = 2 * Math.PI * 45 // Circle circumference (r=45)
    const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100

    return (
        <Card className="glass h-full relative overflow-hidden group border-slate-200 shadow-sm bg-white">
            <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 h-full flex flex-col items-center justify-center relative z-10">
                <div className="flex items-center justify-between w-full mb-6 text-slate-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider">Health Score</span>
                    </div>
                    <Info className="h-3.5 w-3.5 hover:text-slate-900 cursor-help transition-colors" />
                </div>

                <div className="relative h-40 w-40 mb-6 font-bold">
                    {/* Background Circle */}
                    <svg className="h-full w-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="80"
                            cy="80"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            initial={{ strokeDashoffset: strokeDasharray }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            strokeLinecap="round"
                            className={getColor(score)}
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="text-4xl text-slate-900 font-black tabular-nums"
                        >
                            {score}
                        </motion.span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Points</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className={`text-sm font-black mb-1 ${getColor(score)}`}>{getLabel(score)}</p>
                    <p className="text-[10px] text-slate-400 max-w-[120px] leading-relaxed mx-auto font-medium">
                        Based on your savings rate & spending habits
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
