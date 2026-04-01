"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
    LayoutDashboard,
    CreditCard,
    Sparkles,
    MessageSquare,
    TrendingUp,
    FileText,
    Settings,
    LogOut,
    Wallet,
    Target,
    Landmark,
    PieChart,
    ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: CreditCard },
    { href: "/insights", label: "AI Insights", icon: Sparkles },
    { href: "/chat", label: "AI Chat", icon: MessageSquare },
    { href: "/predictions", label: "Predictions", icon: TrendingUp },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/budgets", label: "Budgets", icon: PieChart },
    { href: "/debt", label: "Debt Tracker", icon: Landmark },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <aside className="fixed left-0 top-0 z-40 h-full w-64 flex flex-col bg-[#fcfcfc] border-r border-slate-200 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-6 border-b border-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-sm shadow-emerald-200">
                    <Wallet className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">FinSight</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                active
                                    ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-colors", active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600")} />
                            {label}
                            {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-emerald-400" />}
                        </Link>
                    )
                })}
            </nav>

            {/* User section */}
            <div className="border-t border-slate-100 px-4 py-5 bg-white/50 backdrop-blur-sm">
                {session?.user && (
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        {session.user.image ? (
                            <img
                                src={session.user.image}
                                alt="avatar"
                                className="h-9 w-9 rounded-full ring-2 ring-slate-50 shadow-sm"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                {session.user.name?.[0] ?? "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">{session.user.email?.split('@')[0]}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all group"
                >
                    <LogOut className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
                    Sign out
                </button>
            </div>
        </aside>
    )
}
