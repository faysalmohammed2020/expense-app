import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const page = request.nextUrl.searchParams.get("page") || "1"
    const limit = request.nextUrl.searchParams.get("limit") || "10"

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const [incomes, total] = await Promise.all([
      prisma.income.findMany({
        where: { userId },
        skip,
        take: Number.parseInt(limit),
        orderBy: { date: "desc" },
      }),
      prisma.income.count({ where: { userId } }),
    ])

    return NextResponse.json({
      incomes,
      total,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(total / Number.parseInt(limit)),
    })
  } catch (error) {
    console.error("Income fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, amount, category, source, date, isRecurring, recurringFrequency } = await request.json()

    const income = await prisma.income.create({
      data: {
        userId,
        title,
        description,
        amount: Number.parseFloat(amount),
        category,
        source,
        date: new Date(date),
        isRecurring,
        recurringFrequency,
      },
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error("Income creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
