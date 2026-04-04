import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const { description, amount, type, category, date } = body

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            ...(description ? { description } : {}),
            ...(amount !== undefined ? { amount: parseFloat(amount) } : {}),
            ...(type ? { type } : {}),
            ...(category ? { category } : {}),
            ...(date ? { date: new Date(date) } : {}),
        },
    })

    return NextResponse.json({ transaction: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const existing = await prisma.transaction.findFirst({ where: { id, userId: user.id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.transaction.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
