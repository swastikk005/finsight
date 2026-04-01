import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getUserAnalytics } from "@/lib/analytics"
import { generatePredictions } from "@/lib/predictions"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const stats = await getUserAnalytics(user.id)
    const predictions = generatePredictions(stats.monthly, 3)

    return NextResponse.json({ predictions })
}
