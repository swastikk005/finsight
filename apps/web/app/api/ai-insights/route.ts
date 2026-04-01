import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { openai } from "@/lib/openai"
import { getUserAnalytics } from "@/lib/analytics"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ 
        where: { email: session.user.email },
        select: { id: true, currency: true }
    })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const stats = await getUserAnalytics(user.id)

    if (stats.totalTransactions === 0) {
        return NextResponse.json({
            insights: [
                { type: "default", title: "Get Started", description: "Add your first income or expense transaction to start receiving AI-powered financial insights." },
            ],
        })
    }

    const currency = user.currency || "INR"
    const prompt = `You are a personal finance AI. Analyze the following financial data and generate exactly 3-5 actionable insights. Return ONLY a valid JSON array of objects with keys: type (one of: positive, warning, trending, default), title (max 8 words), description (max 20 words, specific advice).

Financial Data:
- Monthly Income: ${currency} ${stats.totalIncome.toFixed(0)}
- Monthly Expense: ${currency} ${stats.totalExpense.toFixed(0)}
- Net Balance: ${currency} ${stats.net.toFixed(0)}
- Savings Rate: ${stats.savingsRate.toFixed(1)}%
- Safe Daily Spending: ${currency} ${stats.safeDailySpend.toFixed(0)}
- Salary Lasts for: ${stats.daysUntilBurnout} days
- Detected Spikes: ${stats.spikes.length > 0 ? stats.spikes.map(s => `${s.description} (${currency} ${s.amount})`).join(", ") : "None"}
- Top Categories: ${stats.categories.slice(0, 3).map((c) => `${c.name} (${currency} ${c.value.toFixed(0)})`).join(", ")}

Return format: [{"type":"positive","title":"...","description":"..."}]`

    try {
        const completion = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
        })

        const raw = completion.choices[0]?.message?.content?.trim() ?? "[]"
        const jsonMatch = raw.match(/\[[\s\S]*\]/)
        const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : []
        return NextResponse.json({ insights })
    } catch (e: any) {
        console.error("AI insights error:", e.message)
        return NextResponse.json({
            insights: [
                { type: "warning", title: "AI Unavailable", description: "Configure OPENAI_API_KEY to enable AI-powered insights." },
            ],
        })
    }
}
