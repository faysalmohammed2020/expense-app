import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Get current month income
    const monthlyIncome = await prisma.income.aggregate({
      where: {
        userId,
        date: {
          gte: currentMonth,
          lt: nextMonth,
        },
      },
      _sum: { amount: true },
    })

    // Get current month expenses
    const monthlyExpenses = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: currentMonth,
          lt: nextMonth,
        },
      },
      _sum: { amount: true },
    })

    // Get total income (all time)
    const totalIncome = await prisma.income.aggregate({
      where: { userId },
      _sum: { amount: true },
    })

    // Get total expenses (all time)
    const totalExpenses = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    })

    // Get bank accounts total
    const bankAccounts = await prisma.bankAccount.aggregate({
      where: { userId },
      _sum: { balance: true },
    })

    // Get pending rent
    const pendingRent = await prisma.rentPayment.aggregate({
      where: {
        userId,
        status: "pending",
      },
      _sum: { amount: true },
    })

    return NextResponse.json({
      monthlyIncome: monthlyIncome._sum.amount || 0,
      monthlyExpenses: monthlyExpenses._sum.amount || 0,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      bankBalance: bankAccounts._sum.balance || 0,
      pendingRent: pendingRent._sum.amount || 0,
      monthlyBalance: (monthlyIncome._sum.amount || 0) - (monthlyExpenses._sum.amount || 0),
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
