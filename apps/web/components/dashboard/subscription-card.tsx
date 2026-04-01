"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Calendar, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Subscription {
    name: string
    amount: number
    count: number
}

interface SubscriptionCardProps {
    subscriptions: Subscription[]
}

export function SubscriptionCard({ subscriptions }: SubscriptionCardProps) {
    const totalMonthly = subscriptions.reduce((acc, s) => acc + s.amount, 0)

    return (
        <Card className="glass h-full border-slate-200 hover:border-emerald-500/20 transition-all duration-300 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-2 border-b border-slate-50 mb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                        Subscriptions
                    </CardTitle>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-100">
                        {subscriptions.length} Detected
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {subscriptions.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-2.5">
                                {subscriptions.slice(0, 3).map((sub, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                <Calendar className="h-4.5 w-4.5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{sub.name}</p>
                                                <p className="text-[10px] font-medium text-slate-400">Monthly</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-black text-slate-900">{formatCurrency(sub.amount)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Monthly</p>
                                <p className="text-base font-black text-emerald-600">{formatCurrency(totalMonthly)}</p>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-xs font-medium text-slate-400">No recurring subscriptions detected yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
