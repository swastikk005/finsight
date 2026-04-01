import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Target, Plus, Smartphone, Plane, Bike, Car, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog"
import { formatCurrency } from "@/lib/utils"

const iconMap: Record<string, any> = {
    phone: Smartphone,
    trip: Plane,
    bike: Bike,
    car: Car,
    home: Home,
    shopping: ShoppingBag,
    other: Target
}

export default async function GoalsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        include: { goals: true }
    })
    if (!user) return null

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Financial Goals</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Track and achieve your savings targets with AI support.</p>
                </div>
                <CreateGoalDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.goals.length === 0 ? (
                    <Card className="lg:col-span-3 border-dashed border-slate-200 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Target className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No goals set yet</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-2 mb-8">
                                Give your savings a purpose. Whether it's a new iPhone or a trip to Bali, start tracking today.
                            </p>
                            <CreateGoalDialog />
                        </CardContent>
                    </Card>
                ) : (
                    user.goals.map((goal) => {
                        const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                        const category = goal.title.toLowerCase()
                        const IconComponent = Object.entries(iconMap).find(([key]) => category.includes(key))?.[1] || Target

                        return (
                            <Card key={goal.id} className="bg-white border-slate-200 shadow-sm group hover:border-emerald-500/20 hover:shadow-md transition-all duration-300 overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                                            <IconComponent className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                            {progress === 100 ? "Completed" : `${progress}% Done`}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg font-black text-slate-900 mt-4 tracking-tight">{goal.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="space-y-5">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Saved</p>
                                                <p className="text-xl font-black text-slate-900 tabular-nums">{formatCurrency(goal.currentAmount)}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Target</p>
                                                <p className="text-sm font-bold text-slate-500 tabular-nums">{formatCurrency(goal.targetAmount)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-1000" 
                                                style={{ width: `${progress}%` }} 
                                            />
                                        </div>

                                        <p className="text-[10px] text-white/30 leading-relaxed italic">
                                            "Keep going! You're only {formatCurrency(goal.targetAmount - goal.currentAmount)} away from your target."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
