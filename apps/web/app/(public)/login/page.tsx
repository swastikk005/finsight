"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

import { motion } from "framer-motion"
import { ArrowRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      })
      if (result?.error) {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
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

          <h1 className="text-3xl font-black text-center mb-3 text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 font-medium italic text-center text-sm mb-10">
            Sign in to access your elite financial dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                placeholder="hello@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-7 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              By continuing, you agree to our{" "}
              <span className="text-emerald-600 cursor-pointer hover:underline">Terms</span> and{" "}
              <span className="text-emerald-600 cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] uppercase font-black tracking-widest mt-10">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-600 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
