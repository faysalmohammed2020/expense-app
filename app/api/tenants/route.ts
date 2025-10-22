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

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: { userId },
        skip,
        take: Number.parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: { rentPayments: true },
      }),
      prisma.tenant.count({ where: { userId } }),
    ])

    return NextResponse.json({
      tenants,
      total,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(total / Number.parseInt(limit)),
    })
  } catch (error) {
    console.error("Tenants fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email, phone, address, rentAmount, rentDueDate, leaseStartDate, leaseEndDate } = await request.json()

    const tenant = await prisma.tenant.create({
      data: {
        userId,
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

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error("Tenant creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
