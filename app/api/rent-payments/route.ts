import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const tenantId = request.nextUrl.searchParams.get("tenantId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const where: any = { userId }
    if (tenantId) {
      where.tenantId = tenantId
    }

    const payments = await prisma.rentPayment.findMany({
      where,
      orderBy: { dueDate: "desc" },
      include: { tenant: true },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Rent payments fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tenantId, amount, dueDate, paidDate, status, paymentMethod, notes } = await request.json()

    const payment = await prisma.rentPayment.create({
      data: {
        userId,
        tenantId,
        amount: Number.parseFloat(amount),
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : null,
        status,
        paymentMethod,
        notes,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("Rent payment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
