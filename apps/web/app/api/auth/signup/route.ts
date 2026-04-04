import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            } as any,
        })

        return NextResponse.json(
            { success: true, userId: user.id },
            { status: 201 }
        )
    } catch (err) {
        console.error("Signup error:", err)
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}
