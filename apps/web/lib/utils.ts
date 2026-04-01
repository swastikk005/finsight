import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "INR"): string {
    const symbols: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }
    const symbol = symbols[currency] || currency
    return `${symbol}${Math.abs(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

export const CATEGORIES = [
    "Food & Dining",
    "Shopping",
    "Transport",
    "Entertainment",
    "Health",
    "Utilities",
    "Education",
    "Travel",
    "Subscriptions",
    "Other",
]

export const CATEGORY_COLORS: Record<string, string> = {
    "Food & Dining": "#f97316",
    Shopping: "#8b5cf6",
    Transport: "#3b82f6",
    Entertainment: "#ec4899",
    Health: "#22c55e",
    Utilities: "#eab308",
    Education: "#06b6d4",
    Travel: "#6366f1",
    Subscriptions: "#f43f5e",
    Other: "#94a3b8",
}
