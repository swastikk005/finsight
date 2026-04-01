"use client"

import { useEffect, useState } from "react"
import { Search, Filter, ArrowUpDown, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/transactions")
      const data = await res.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const filtered = transactions.filter((t: any) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || t.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage and track your income and expenses.</p>
        </div>
        <TransactionDialog onSuccess={fetchTransactions} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 skeleton rounded-xl w-full" />
          ))}
        </div>
      ) : (
        <TransactionTable transactions={filtered} onRefresh={fetchTransactions} />
      )}
    </div>
  )
}
