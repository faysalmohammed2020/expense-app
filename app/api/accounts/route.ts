import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

    return NextResponse.json({
      accounts,
      totalBalance,
    })
  } catch (error) {
    console.error("Accounts fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { accountName, bankName, accountNumber, accountType, balance, currency } = await request.json()

    const account = await prisma.bankAccount.create({
      data: {
        userId,
        accountName,
        bankName,
        accountNumber,
        accountType,
        balance: Number.parseFloat(balance),
        currency,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Account creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
