import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || undefined
    const category = searchParams.get("category") || undefined

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: user.id,
            ...(type ? { type } : {}),
            ...(category ? { category } : {}),
        },
        orderBy: { date: "desc" },
        take: 100,
    })

    return NextResponse.json({ transactions })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await req.json()
    const { description, amount, type, category, date, merchant } = body

    if (!description || amount === undefined || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
        data: {
            userId: user.id,
            description,
            amount: parseFloat(amount),
            type,
            category: category || "Other",
            merchant: merchant || null,
            date: new Date(date || Date.now()),
        },
    })

    return NextResponse.json({ transaction }, { status: 201 })
}
