import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { openai } from "@/lib/openai"
import { getUserAnalytics } from "@/lib/analytics"
import { NextResponse } from "next/server"

export async function POST() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const stats = await getUserAnalytics(user.id)

    const prompt = `Based on the following spending data, suggest a monthly budget for each category. Aim for a 10% reduction in elective categories like Shopping and Food. Return ONLY a valid JSON array of objects with keys: category, amount.

Spending Data (Monthly):
${stats.categories.map(c => `- ${c.name}: ₹${c.value}`).join("\n")}

Return format: [{"category":"Food & Dining", "amount": 5000}]`

    try {
        const completion = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        })

        const raw = completion.choices[0]?.message?.content?.trim() ?? "[]"
        const jsonMatch = raw.match(/\[[\s\S]*\]/)
        const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : []

        // Delete existing budgets and create new ones
        await prisma.budget.deleteMany({ where: { userId: user.id } })
        
        const budgets = await prisma.budget.createMany({
            data: suggestions.map((s: any) => ({
                userId: user.id,
                category: s.category,
                amount: s.amount,
            }))
        })

        return NextResponse.json({ success: true, count: suggestions.length })
    } catch (error) {
        console.error("Budget generation error:", error)
        return NextResponse.json({ error: "Failed to generate budgets" }, { status: 500 })
    }
}
