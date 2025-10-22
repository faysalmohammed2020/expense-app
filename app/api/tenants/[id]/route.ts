import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: { rentPayments: { orderBy: { dueDate: "desc" } } },
    })

    if (!tenant || tenant.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Tenant fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
    })

    if (!tenant || tenant.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { name, email, phone, address, rentAmount, rentDueDate, leaseStartDate, leaseEndDate } = await request.json()

    const updated = await prisma.tenant.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        address,
        rentAmount: Number.parseFloat(rentAmount),
        rentDueDate: Number.parseInt(rentDueDate),
        leaseStartDate: new Date(leaseStartDate),
        leaseEndDate: leaseEndDate ? new Date(leaseEndDate) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Tenant update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
    })

    if (!tenant || tenant.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.tenant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tenant delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
