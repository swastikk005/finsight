"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Sparkles, MessageSquare, Shield, Wallet, BarChart3, Bot, ChevronRight, Activity, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  { icon: Activity, title: "Financial Health Score", desc: "Get an AI-calculated score from 0-100 based on your savings, debt, and income growth." },
  { icon: Sparkles, title: "AI Copilot", desc: "GPT-powered analysis gives you actionable financial insights and overspending alerts daily." },
  { icon: Bot, title: "Subscription Detector", desc: "Automatically identify and track Netflix, Spotify, and other hidden recurring costs." },
  { icon: TrendingUp, title: "Smart Predictions", desc: "Advanced forecasts of your future spending, burn rate, and savings potential." },
  { icon: Shield, title: "Multi-Account Sync", desc: "Track cash, bank accounts, and credit cards in one secure, unified dashboard." },
  { icon: Percent, title: "Budget Limits", desc: "Set smart limits and receive AI-driven warnings before you overspend." },
]

const pricing = [
  { name: "Starter", price: "₹0", period: "/mo", features: ["1 Account support", "Basic dashboard", "5 AI Insights/mo"], cta: "Get Started", popular: false },
  { name: "Elite", price: "₹499", period: "/mo", features: ["Unlimited Accounts", "Financial Health Score", "Subscription Detector", "Advanced Predictions", "AI Chat Copilot"], cta: "Unlock Elite Now", popular: true },
  { name: "Business", price: "₹1499", period: "/mo", features: ["Everything in Elite", "Team management", "Priority AI processing", "Export CSV/PDF"], cta: "Contact Sales", popular: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6 border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-200">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">FinSight</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-black text-slate-600 hover:text-slate-900">Sign in</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 rounded-xl shadow-lg shadow-emerald-100 hidden sm:flex gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[10px] uppercase font-black tracking-widest mb-10 shadow-sm"
        >
          <Sparkles className="h-4 w-4" /> Elite AI Financial Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl lg:text-8xl font-black tracking-tighter max-w-5xl leading-tight text-slate-900"
        >
          Your money,{" "}
          <span className="text-emerald-600 italic">intelligently</span>{" "}
          managed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-xl text-slate-500 max-w-2xl leading-relaxed font-medium italic"
        >
          FinSight uses AI to analyze your spending, predict your financial future, and give you personalized insights — all in one premium dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 mt-12"
        >
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-16 px-10 rounded-2xl shadow-2xl shadow-emerald-100 text-lg gap-3 active:scale-95 transition-all">
              Start for free <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-slate-200 text-slate-600 font-black hover:bg-slate-50 active:scale-95 transition-all">
              View demo dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-12 mt-20 text-center"
        >
          {[["₹2.4Cr+", "Tracked monthly"], ["12K+", "Active users"], ["99.9%", "Uptime"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-black text-slate-900 tabular-nums">{val}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-12 py-32 border-t border-slate-100 bg-slate-50/30">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">Everything you need to take control</h2>
          <p className="mt-4 text-slate-500 font-medium italic max-w-xl mx-auto">A full financial intelligence suite powered by the latest AI models.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-32 p-8 border border-slate-100 hover:border-emerald-500/30 transition-all duration-500 group shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-[2rem]"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all duration-500 shadow-inner">
                <f.icon className="h-7 w-7 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{f.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-6 lg:px-12 py-32 border-t border-slate-100">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Simple, transparent pricing</h2>
          <p className="mt-4 text-slate-500 font-medium italic">No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricing.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-emerald-500/20 ${p.popular ? "ring-2 ring-emerald-500 ring-offset-8" : ""}`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] uppercase font-black tracking-[0.2em] shadow-xl shadow-emerald-200 ring-4 ring-white">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{p.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{p.price}</span>
                  <span className="text-slate-400 font-black text-xs uppercase tracking-widest">{p.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm font-black text-slate-600">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 shadow-inner">
                      <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className={`${p.popular ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 shadow-xl" : "bg-slate-900 hover:bg-black shadow-slate-100 shadow-xl"} text-white font-black h-14 rounded-2xl w-full text-base active:scale-[0.98] transition-all`}>
                  {p.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-40 border-t border-slate-100 text-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-600/30 rounded-full blur-[120px] -translate-y-1/2" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-4xl lg:text-7xl font-black mb-8 tracking-tighter">Ready to take control of your finances?</h2>
          <p className="text-slate-400 text-xl mb-12 font-medium italic">Join thousands using FinSight to make smarter money decisions.</p>
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-20 px-16 rounded-[2rem] text-xl shadow-2xl shadow-emerald-950/50 active:scale-95 transition-all">
              Get started free <ArrowRight className="h-8 w-8 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 bg-white py-12 px-6 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        © 2026 FinSight Enterprise Elite. Built with ❤️ and AI.
      </footer>
    </div>
  )
}
