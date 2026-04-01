import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { openai } from "@/lib/openai"
import { getUserAnalytics } from "@/lib/analytics"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { messages } = await req.json()

    const stats = await getUserAnalytics(user.id)

    const systemPrompt = `You are FinSight AI, a friendly and concise personal finance assistant. The user's financial context:
- Monthly Income: ₹${stats.totalIncome.toFixed(0)}
- Monthly Expense: ₹${stats.totalExpense.toFixed(0)}
- Net Balance: ₹${stats.net.toFixed(0)}
- Savings Rate: ${stats.savingsRate.toFixed(1)}%
- Top Spending Categories: ${stats.categories.slice(0, 4).map((c) => `${c.name} (₹${c.value.toFixed(0)})`).join(", ")}
- Total Transactions: ${stats.totalTransactions}

Provide helpful, personalized financial advice. Be concise. Use ₹ for Indian Rupees.`

    try {
        const stream = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.slice(-8),
            ],
            temperature: 0.7,
            max_tokens: 400,
            stream: true,
        })

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content || ""
                    if (text) controller.enqueue(encoder.encode(text))
                }
                controller.close()
            },
        })

        return new NextResponse(readable, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
    } catch (e: any) {
        console.error("AI Chat Error:", e)
        return NextResponse.json({ 
            error: e.message || "AI unavailable. Check OPENAI_API_KEY." 
        }, { status: 500 })
    }
}
