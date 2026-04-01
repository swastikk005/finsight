"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, ArrowRight, CheckCircle, PiggyBank, Target, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const steps = [
    {
        id: "welcome",
        title: "Welcome to FinSight",
        description: "Let's personalize your AI financial intelligence platform in 3 quick steps.",
        icon: Wallet,
    },
    {
        id: "currency",
        title: "Primary Currency",
        description: "What is your primary currency for tracking expenses?",
        icon: Landmark,
    },
    {
        id: "income",
        title: "Monthly Income",
        description: "How much do you typically earn in a month?",
        icon: PiggyBank,
    },
    {
        id: "goals",
        title: "Financial Goal",
        description: "What is your primary focus right now?",
        icon: Target,
    },
]

const currencies = [
    { code: "INR", symbol: "₹", label: "Indian Rupee" },
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "GBP", symbol: "£", label: "British Pound" },
]

export default function OnboardingPage() {
    const [step, setStep] = useState(0)
    const [data, setData] = useState({
        currency: "INR",
        monthlyIncome: "",
        primaryGoal: "savings",
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleNext = async () => {
        if (step < steps.length - 1) {
            setStep(step + 1)
        } else {
            setLoading(true)
            try {
                const res = await fetch("/api/user/onboard", {
                    method: "POST",
                    body: JSON.stringify({
                        currency: data.currency,
                        monthlyIncome: data.monthlyIncome,
                    }),
                })
                if (res.ok) {
                    router.push("/dashboard")
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
    }

    const currentStep = steps[step]
    const Icon = currentStep.icon

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-50">
                <motion.div 
                    className="h-full bg-emerald-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-lg"
                >
                    <div className="text-center mb-8">
                        <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Icon className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            {currentStep.title}
                        </h1>
                        <p className="text-slate-500 font-medium italic">
                            {currentStep.description}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl mb-8">
                        {step === 0 && (
                            <div className="space-y-4 py-4">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-emerald-100">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-slate-900">Elite Analytics</p>
                                        <p className="text-xs text-slate-500 italic">Proactive financial diagnostics in real-time.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-emerald-100">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-slate-900">AI Copilot</p>
                                        <p className="text-xs text-slate-500 italic">24/7 financial advisor at your fingertips.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-4 py-4">
                                {currencies.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => setData({ ...data, currency: c.code })}
                                        className={`p-6 rounded-2xl border-2 transition-all text-center group ${
                                            data.currency === c.code 
                                                ? "border-emerald-600 bg-emerald-50 shadow-lg" 
                                                : "border-slate-100 bg-white hover:border-emerald-200"
                                        }`}
                                    >
                                        <span className="text-3xl mb-2 block">{c.symbol}</span>
                                        <span className="text-sm font-black text-slate-900 block">{c.code}</span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-hover:text-emerald-400 transition-colors">{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 py-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-400 font-bold">{data.currency}</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={data.monthlyIncome}
                                        onChange={(e) => setData({ ...data, monthlyIncome: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full pl-16 pr-4 py-6 bg-white border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-200"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-slate-400 font-medium italic text-center">
                                    This helps us calculate your safe daily spend and salary runway.
                                </p>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-3 py-4">
                                {[
                                    { id: "savings", label: "Aggressive Savings", desc: "Build wealth as fast as possible" },
                                    { id: "debt", label: "Debt Repayment", desc: "Pay off loans and credit cards" },
                                    { id: "growth", label: "Wealth Growth", desc: "Optimize investments and net worth" },
                                ].map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => setData({ ...data, primaryGoal: g.id })}
                                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                                            data.primaryGoal === g.id 
                                                ? "border-emerald-600 bg-emerald-50 shadow-lg" 
                                                : "border-slate-100 bg-white hover:border-emerald-200"
                                        }`}
                                    >
                                        <div>
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{g.label}</p>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-hover:text-emerald-400 transition-colors">{g.desc}</p>
                                        </div>
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            data.primaryGoal === g.id ? "bg-emerald-600 border-emerald-600" : "border-slate-100"
                                        }`}>
                                            <div className="h-2 w-2 rounded-full bg-white" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <Button 
                            onClick={handleNext}
                            disabled={loading || (step === 2 && !data.monthlyIncome)}
                            className="w-full py-8 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                        >
                            {loading ? "Initializing..." : step === steps.length - 1 ? "Finish Setup" : "Continue"}
                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                        
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            Elite SaaS Infrastructure for Financial Peace
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
