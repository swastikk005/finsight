"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CATEGORIES } from "@/lib/utils"

const transactionSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    }),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionDialogProps {
    onSuccess?: () => void
    trigger?: React.ReactNode
    initialData?: any
}

export function TransactionDialog({ onSuccess, trigger, initialData }: TransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: initialData || {
            type: "expense",
            category: "Other",
            date: new Date().toISOString().split("T")[0],
        },
    })

    const type = watch("type")
    const category = watch("category")

    const onSubmit = async (data: TransactionFormValues) => {
        setLoading(true)
        try {
            const url = initialData ? `/api/transactions/${initialData.id}` : "/api/transactions"
            const method = initialData ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) throw new Error("Failed to save transaction")

            setOpen(false)
            reset()
            onSuccess?.()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="gradient" className="gap-2">
                        <Plus className="h-4 w-4" /> Add Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit" : "Add"} Transaction</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update your transaction details below." : "Enter the details of your new income or expense."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="e.g. Grocery shopping, Salary"
                            {...register("description")}
                        />
                        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register("amount")}
                            />
                            {errors.amount && <p className="text-xs text-red-400">{errors.amount.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register("date")}
                            />
                            {errors.date && <p className="text-xs text-red-400">{errors.date.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={type}
                                onValueChange={(val) => setValue("type", val as "income" | "expense")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expense">Expense</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={category}
                                onValueChange={(val) => setValue("category", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {initialData ? "Update" : "Save"} Transaction
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
