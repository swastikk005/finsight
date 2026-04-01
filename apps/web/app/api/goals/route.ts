import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    try {
        const body = await req.json()
        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                title: body.title,
                targetAmount: body.targetAmount,
                currentAmount: 0,
            }
        })
        return NextResponse.json(goal)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
    }
}
