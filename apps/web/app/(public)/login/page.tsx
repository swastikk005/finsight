"use client"

import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { ArrowRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
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

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

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
          <Link href="/login" className="text-emerald-600 hover:underline">
            It's free to start
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
