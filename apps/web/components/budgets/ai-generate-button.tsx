"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIGenerateButton() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    async function handleGenerate() {
        setLoading(true)
        try {
            const res = await fetch("/api/budgets/generate", {
                method: "POST",
            })

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button 
            variant="outline" 
            onClick={handleGenerate}
            disabled={loading}
            className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 gap-2 min-w-[140px] shadow-sm font-bold active:scale-95 transition-all"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            ) : success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
                <Sparkles className="h-4 w-4 text-emerald-600" />
            )}
            {loading ? "Generating..." : success ? "Generated!" : "AI Generate"}
        </Button>
    )
}
