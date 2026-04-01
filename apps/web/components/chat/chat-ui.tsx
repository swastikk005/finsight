"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
    role: "user" | "assistant"
    content: string
}

const SUGGESTED_PROMPTS = [
    "How much did I spend this month?",
    "What's my biggest expense category?",
    "How can I save more money?",
    "Predict my spending for next month",
]

export function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm FinSight AI. I have access to your financial data. How can I help you today?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (text?: string) => {
        const msg = text || input
        if (!msg.trim() || isLoading) return

        const newMessages: Message[] = [...messages, { role: "user", content: msg }]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to get response")
            }

            const reader = response.body?.getReader()
            if (!reader) throw new Error("No reader")

            setMessages((prev) => [...prev, { role: "assistant", content: "" }])

            let accumulated = ""
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const text = new TextDecoder().decode(value)
                accumulated += text
                setMessages((prev) => {
                    const last = prev[prev.length - 1]
                    if (last.role === "assistant") {
                        return [...prev.slice(0, -1), { role: "assistant", content: accumulated }]
                    }
                    return prev
                })
            }
        } catch (error: any) {
            console.error(error)
            setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I'm having trouble connecting: ${error.message}` }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto px-4 lg:px-0">
            <Card className="flex-1 overflow-hidden flex flex-col bg-white border-slate-200 shadow-xl rounded-[2.5rem]">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                            <Bot className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">FinSight AI Copilot</h2>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Always Online
                            </p>
                        </div>
                    </div>
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                                    m.role === "assistant" 
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                        : "bg-slate-100 text-slate-400 border-slate-200"
                                    }`}>
                                    {m.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </div>
                                <div className={`max-w-[75%] rounded-[1.5rem] px-5 py-4 text-sm font-medium leading-relaxed shadow-sm ${
                                    m.role === "assistant"
                                        ? "bg-slate-50 text-slate-900 border border-slate-100 rounded-tl-none"
                                        : "bg-emerald-600 text-white rounded-tr-none shadow-emerald-100 shadow-lg"
                                    }`}>
                                    {m.content || (isLoading && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : "")}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {messages.length === 1 && (
                    <div className="px-8 pb-6">
                        <p className="text-[10px] text-slate-400 mb-3 ml-1 font-black uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-emerald-500" /> Suggested Inquiries
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_PROMPTS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handleSend(p)}
                                    className="text-xs font-black border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 px-4 py-2 rounded-xl transition-all text-slate-600 hover:text-emerald-700 active:scale-95"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-3"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your financial question..."
                            className="flex-1 bg-white border-slate-200 h-14 px-6 rounded-2xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500/10 font-medium"
                            disabled={isLoading}
                        />
                        <Button size="icon" type="submit" disabled={!input.trim() || isLoading} className="h-14 w-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 active:scale-95 transition-all">
                            <Send className="h-6 w-6" />
                        </Button>
                    </form>
                    <p className="text-[10px] text-center text-slate-400 mt-4 font-medium italic">
                        AI-generated advice should not replace professional financial guidance.
                    </p>
                </div>
            </Card>
        </div>
    )
}
