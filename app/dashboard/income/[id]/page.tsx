"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { IncomeForm } from "@/components/income-form"
import { useAuthStore } from "@/lib/auth-context"

export default function EditIncomePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuthStore()
  const [income, setIncome] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user || !params.id) return

    const fetchIncome = async () => {
      try {
        const response = await fetch(`/api/income/${params.id}`, {
          headers: { "x-user-id": user.id },
        })

        if (!response.ok) {
          throw new Error("Income not found")
        }

        const data = await response.json()
        setIncome(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchIncome()
  }, [user, params.id])

  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/income/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update income")
      }

      router.push("/income")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Edit Income</h1>
            <Link href="/income" className="btn-secondary px-6 py-3">
              Back to Income
            </Link>
          </div>

          <div className="card p-8">
            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : income ? (
              <IncomeForm initialData={income} onSubmit={handleSubmit} isLoading={submitting} />
            ) : (
              <p className="text-center text-foreground-secondary">Income not found</p>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
