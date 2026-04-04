"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/Progress"

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")
    const [progress, setProgress] = useState(0)

    async function handleUpload() {
        if (!file) return

        setStatus("uploading")
        setProgress(10)

        const form = new FormData()
        form.append("file", file)

        try {
            // Simulate progress for better UX
            const interval = setInterval(() => {
                setProgress(prev => prev < 90 ? prev + 10 : prev)
            }, 300)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: form,
            })

            clearInterval(interval)
            const json = await res.json()

            if (res.ok) {
                setProgress(100)
                setStatus("success")
                setMessage(`Successfully imported ${json.count} transactions with AI auto-categorization.`)
            } else {
                setStatus("error")
                setMessage(json.error || "Upload failed. Please check the CSV format.")
            }
        } catch (_error) {
            setStatus("error")
            setMessage("An unexpected error occurred during import.")
        }
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Import Financial Data</h1>
                <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
                    Upload your bank statement (CSV) and let our AI handle the rest. We'll auto-categorize and sync every entry.
                </p>
            </div>

            <Card className="bg-white relative overflow-hidden p-12 border-dashed border-slate-200 hover:border-emerald-500/30 transition-all duration-500 rounded-[2.5rem] shadow-sm group">
                <CardContent className="p-0 flex flex-col items-center justify-center text-center space-y-6">
                    <AnimatePresence mode="wait">
                        {status === "idle" && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6 w-full"
                            >
                                <div className="h-24 w-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto group shadow-sm">
                                    <Upload className="h-12 w-12 text-emerald-600 group-hover:scale-110 transition-transform" />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xl font-black text-slate-900">Click to upload or drag & drop</p>
                                    <p className="text-xs text-slate-400 font-medium italic">Supports .csv (Date, Description, Amount)</p>
                                </div>

                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />

                                {file && (
                                    <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-xl border border-emerald-100 max-w-sm mx-auto shadow-sm">
                                        <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
                                        <span className="text-sm text-emerald-700 truncate font-black">{file.name}</span>
                                    </div>
                                )}

                                <Button
                                    onClick={handleUpload}
                                    disabled={!file}
                                    className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-emerald-100 text-lg active:scale-[0.98] transition-all"
                                >
                                    Start AI Import
                                </Button>
                            </motion.div>
                        )}

                        {status === "uploading" && (
                            <motion.div
                                key="uploading"
                                className="space-y-6 w-full py-10"
                            >
                                <div className="h-24 w-24 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto relative overflow-hidden shadow-sm">
                                    <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                                </div>
                                <div className="space-y-4 max-w-sm mx-auto">
                                    <p className="text-xl font-black text-slate-900">Categorizing Transactions...</p>
                                    <Progress value={progress} className="h-2 bg-slate-100" />
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-teal-600 font-black uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100 w-fit mx-auto">
                                        <Sparkles className="h-4 w-4" />
                                        Processing with FinSight AI
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div
                                key="success"
                                className="space-y-6 w-full py-10"
                            >
                                <div className="h-24 w-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">Import Complete!</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto italic">{message}</p>
                                </div>
                                <Button
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-emerald-100"
                                >
                                    View Dashboard
                                </Button>
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div
                                key="error"
                                className="space-y-6 w-full py-10"
                            >
                                <div className="h-24 w-24 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto shadow-sm">
                                    <AlertCircle className="h-12 w-12 text-red-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">Import Failed</h3>
                                    <p className="text-sm font-medium text-red-600/70 max-w-xs mx-auto italic">{message}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setStatus("idle")}
                                    className="border-slate-200 hover:bg-slate-50 font-black px-8"
                                >
                                    Try Again
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Bottom info grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-slate-200 border p-6 rounded-2xl shadow-sm flex gap-4">
                    <ShieldCheck className="h-7 w-7 text-emerald-600 shrink-0" />
                    <div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">Privacy First</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Your transactions are encrypted and only accessible by you. We never share your financial data.
                        </p>
                    </div>
                </div>
                <div className="bg-white border-slate-200 border p-6 rounded-2xl shadow-sm flex gap-4">
                    <Sparkles className="h-7 w-7 text-teal-600 shrink-0" />
                    <div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">Auto-Categorization</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Our AI identifies merchants and categories automatically, so you don't have to tag them manually.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
