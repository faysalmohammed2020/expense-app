import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.bankAccount.findUnique({
      where: { id: params.id },
    })

    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Account fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.bankAccount.findUnique({
      where: { id: params.id },
    })

    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { accountName, bankName, accountNumber, accountType, balance, currency } = await request.json()

    const updated = await prisma.bankAccount.update({
      where: { id: params.id },
      data: {
        accountName,
        bankName,
        accountNumber,
        accountType,
        balance: Number.parseFloat(balance),
        currency,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Account update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.bankAccount.findUnique({
      where: { id: params.id },
    })

    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.bankAccount.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Account delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
