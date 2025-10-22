"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuthStore } from "@/lib/auth-context"

interface Expense {
  id: string
  title: string
  amount: number
  category: string
  paymentMethod: string
  date: string
  isRecurring: boolean
}

export default function ExpensesPage() {
  const { user } = useAuthStore()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    if (!user) return

    const fetchExpenses = async () => {
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(categoryFilter && { category: categoryFilter }),
        })

        const response = await fetch(`/api/expenses?${query}`, {
          headers: { "x-user-id": user.id },
        })
        const data = await response.json()
        setExpenses(data.expenses)
        setTotal(data.total)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [user, page, categoryFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "" },
      })

      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense.id !== id))
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Expense Management</h1>
            <Link href="/dashboard/expenses/new" className="btn-primary px-6 py-3">
              Add Expense
            </Link>
          </div>

          {/* Filter */}
          <div className="card p-4 mb-6">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="food">Food & Dining</option>
              <option value="transport">Transport</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-foreground-secondary mb-4">No expense records yet</p>
              <Link href="/dashboard/expenses/new" className="btn-primary px-6 py-3 inline-block">
                Add Your First Expense
              </Link>
            </div>
          ) : (
            <>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-background-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Payment Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-border hover:bg-background-secondary">
                        <td className="px-6 py-4">{expense.title}</td>
                        <td className="px-6 py-4 capitalize">{expense.category}</td>
                        <td className="px-6 py-4 font-semibold">৳ {expense.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 capitalize">{expense.paymentMethod.replace("_", " ")}</td>
                        <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <Link href={`/dashboard/expenses/${expense.id}`} className="text-primary hover:underline text-sm">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-danger hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary px-4 py-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {Math.ceil(total / 10)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / 10)}
                  className="btn-secondary px-4 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
