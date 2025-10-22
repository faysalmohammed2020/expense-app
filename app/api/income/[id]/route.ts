import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const income = await prisma.income.findUnique({
      where: { id: params.id },
    })

    if (!income || income.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(income)
  } catch (error) {
    console.error("Income fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const income = await prisma.income.findUnique({
      where: { id: params.id },
    })

    if (!income || income.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { title, description, amount, category, source, date, isRecurring, recurringFrequency } = await request.json()

    const updated = await prisma.income.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Income update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const income = await prisma.income.findUnique({
      where: { id: params.id },
    })

    if (!income || income.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.income.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Income delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
