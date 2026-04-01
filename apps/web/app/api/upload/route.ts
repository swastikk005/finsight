import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { parseCSV } from "@/lib/csv-parser"
import { categorizeTransaction } from "@/lib/analytics"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 })
  }

  const text = await file.text()

  const rows = await parseCSV(text)

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const batch = await prisma.uploadBatch.create({
    data: {
      userId: user.id,
      fileName: file.name,
    },
  })

  // Group and categorize
  const transactionsData = rows.map((row: any) => ({
    userId: user.id,
    uploadId: batch.id,
    date: new Date(row.date),
    description: row.description,
    amount: row.amount,
    type: row.amount >= 0 ? "income" : "expense",
    category: categorizeTransaction(row.description),
  }))

  await prisma.transaction.createMany({
    data: transactionsData,
  })

  return NextResponse.json({ success: true, count: rows.length })
}
