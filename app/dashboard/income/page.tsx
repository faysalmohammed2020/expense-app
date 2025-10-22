"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth-context"

interface Income {
  id: string
  title: string
  amount: number
  category: string
  date: string
  isRecurring: boolean
}

export default function IncomePage() {
  const { user } = useAuthStore()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchIncomes = async () => {
      try {
        const response = await fetch(`/api/income?page=${page}&limit=10`, {
          headers: { "x-user-id": user.id },
        })
        const data = await response.json()
        setIncomes(data.incomes)
        setTotal(data.total)
      } catch (error) {
        console.error("Error fetching incomes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncomes()
  }, [user, page])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) return

    try {
      const response = await fetch(`/api/income/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "" },
      })

      if (response.ok) {
        setIncomes(incomes.filter((income) => income.id !== id))
      }
    } catch (error) {
      console.error("Error deleting income:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Income Management</h1>
        <Link href="/dashboard/income/new" className="btn-primary px-6 py-3">
          Add Income
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : incomes.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-foreground-secondary mb-4">No income records yet</p>
          <Link href="/dashboard/income/new" className="btn-primary px-6 py-3 inline-block">
            Add Your First Income
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Recurring</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id} className="border-b border-border hover:bg-background-secondary">
                    <td className="px-6 py-4">{income.title}</td>
                    <td className="px-6 py-4 capitalize">{income.category}</td>
                    <td className="px-6 py-4 font-semibold">৳ {income.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">{new Date(income.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{income.isRecurring ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link href={`/income/${income.id}`} className="text-primary hover:underline text-sm">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(income.id)} className="text-danger hover:underline text-sm">
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
  )
}
