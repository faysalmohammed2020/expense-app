import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    })

    if (!expense || expense.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Expense fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    })

    if (!expense || expense.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { title, description, amount, category, paymentMethod, date, isRecurring, recurringFrequency } =
      await request.json()

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Expense update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    })

    if (!expense || expense.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.expense.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Expense delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
