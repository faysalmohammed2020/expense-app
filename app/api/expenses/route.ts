import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const page = request.nextUrl.searchParams.get("page") || "1"
    const limit = request.nextUrl.searchParams.get("limit") || "10"
    const category = request.nextUrl.searchParams.get("category")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const where: any = { userId }
    if (category) {
      where.category = category
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: Number.parseInt(limit),
        orderBy: { date: "desc" },
      }),
      prisma.expense.count({ where }),
    ])

    return NextResponse.json({
      expenses,
      total,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(total / Number.parseInt(limit)),
    })
  } catch (error) {
    console.error("Expense fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, amount, category, paymentMethod, date, isRecurring, recurringFrequency } =
      await request.json()

    const expense = await prisma.expense.create({
      data: {
        userId,
        title,
        description,
        amount: Number.parseFloat(amount),
        category,
        paymentMethod,
        date: new Date(date),
        isRecurring,
        recurringFrequency,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Expense creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
