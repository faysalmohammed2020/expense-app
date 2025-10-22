"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountForm } from "@/components/account-form"
import { useAuthStore } from "@/lib/auth-context"

export default function EditAccountPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuthStore()
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user || !params.id) return

    const fetchAccount = async () => {
      try {
        const response = await fetch(`/api/accounts/${params.id}`, {
          headers: { "x-user-id": user.id },
        })

        if (!response.ok) {
          throw new Error("Account not found")
        }

        const data = await response.json()
        setAccount(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [user, params.id])

  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/accounts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update account")
      }

      router.push("/dashboard/accounts")
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
            <h1 className="text-3xl font-bold">Edit Bank Account</h1>
            <Link href="/dashboard/accounts" className="btn-secondary px-6 py-3">
              Back to Accounts
            </Link>
          </div>

          <div className="card p-8">
            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : account ? (
              <AccountForm initialData={account} onSubmit={handleSubmit} isLoading={submitting} />
            ) : (
              <p className="text-center text-foreground-secondary">Account not found</p>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
