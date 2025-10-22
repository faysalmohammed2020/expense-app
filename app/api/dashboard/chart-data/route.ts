import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const period = request.nextUrl.searchParams.get("period") || "month"

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let startDate = new Date()
    if (period === "month") {
      startDate.setDate(1)
    } else if (period === "quarter") {
      const quarter = Math.floor(startDate.getMonth() / 3)
      startDate = new Date(startDate.getFullYear(), quarter * 3, 1)
    } else if (period === "year") {
      startDate = new Date(startDate.getFullYear(), 0, 1)
    }

    // Get income by category
    const incomeByCategory = await prisma.income.groupBy({
      by: ["category"],
      where: {
        userId,
        date: { gte: startDate },
      },
      _sum: { amount: true },
    })

    // Get expenses by category
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["category"],
      where: {
        userId,
        date: { gte: startDate },
      },
      _sum: { amount: true },
    })

    // Get daily income/expense trend
    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE(date) as date,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM (
        SELECT date, amount, 'income' as type FROM "Income" WHERE "userId" = ${userId} AND date >= ${startDate}
        UNION ALL
        SELECT date, amount, 'expense' as type FROM "Expense" WHERE "userId" = ${userId} AND date >= ${startDate}
      ) combined
      GROUP BY DATE(date)
      ORDER BY date DESC
      LIMIT 30
    `

    return NextResponse.json({
      incomeByCategory: incomeByCategory.map((item) => ({
        category: item.category,
        amount: item._sum.amount || 0,
      })),
      expensesByCategory: expensesByCategory.map((item) => ({
        category: item.category,
        amount: item._sum.amount || 0,
      })),
      dailyTrend: dailyData,
    })
  } catch (error) {
    console.error("Chart data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
