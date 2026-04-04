"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Wallet, UserCircle, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            router.push("/login?message=Account created successfully")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl relative z-20">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">FinSight</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-center mb-3 text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 font-medium italic text-center text-sm mb-10">
                        Join the elite circle of financial intelligence
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                                    placeholder="hello@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-7 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    Launch Dashboard <ArrowRight className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            Already have an account?{" "}
                            <Link href="/login" className="text-emerald-600 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
