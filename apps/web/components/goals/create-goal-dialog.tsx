"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Target, Smartphone, Plane, Bike, Car, Home, ShoppingBag, Loader2 } from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateGoalDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get("title"),
            targetAmount: parseFloat(formData.get("amount") as string),
        }

        try {
            const res = await fetch("/api/goals", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })

            if (res.ok) {
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    New Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-slate-200 shadow-2xl sm:max-w-[425px] rounded-[2rem] p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                            <Target className="h-6 w-6 text-emerald-600" />
                        </div>
                        Create Financial Goal
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">What are you saving for?</Label>
                        <Input 
                            id="title" 
                            name="title" 
                            placeholder="e.g. Bali Trip, iPhone 16 Pro" 
                            required 
                            className="bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 h-12 rounded-xl font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Target Amount (INR)</Label>
                        <Input 
                            id="amount" 
                            name="amount" 
                            type="number" 
                            placeholder="₹50,000" 
                            required 
                            className="bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 h-12 rounded-xl font-medium"
                        />
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 text-xs text-emerald-800/70 font-medium leading-relaxed italic shadow-inner">
                        <div className="h-6 w-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                            <Plus className="h-4 w-4 text-emerald-600" />
                        </div>
                        Our AI will track your spending patterns and suggest how much you can contribute weekly towards this goal.
                    </div>

                    <DialogFooter className="pt-2">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl shadow-lg shadow-emerald-100 text-base active:scale-[0.98] transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Elite Goal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
