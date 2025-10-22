import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payment = await prisma.rentPayment.findUnique({
      where: { id: params.id },
    })

    if (!payment || payment.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { amount, dueDate, paidDate, status, paymentMethod, notes } = await request.json()

    const updated = await prisma.rentPayment.update({
      where: { id: params.id },
      data: {
        amount: Number.parseFloat(amount),
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : null,
        status,
        paymentMethod,
        notes,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Rent payment update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payment = await prisma.rentPayment.findUnique({
      where: { id: params.id },
    })

    if (!payment || payment.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.rentPayment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Rent payment delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
