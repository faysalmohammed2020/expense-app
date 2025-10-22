"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { TenantForm } from "@/components/tenant-form"
import { useAuthStore } from "@/lib/auth-context"

export default function EditTenantPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuthStore()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user || !params.id) return

    const fetchTenant = async () => {
      try {
        const response = await fetch(`/api/tenants/${params.id}`, {
          headers: { "x-user-id": user.id },
        })

        if (!response.ok) {
          throw new Error("Tenant not found")
        }

        const data = await response.json()
        setTenant(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTenant()
  }, [user, params.id])

  const handleSubmit = async (formData: any) => {
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/tenants/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update tenant")
      }

      router.push(`/tenants/${params.id}`)
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
            <h1 className="text-3xl font-bold">Edit Tenant</h1>
            <Link href="/tenants" className="btn-secondary px-6 py-3">
              Back to Tenants
            </Link>
          </div>

          <div className="card p-8">
            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : tenant ? (
              <TenantForm initialData={tenant} onSubmit={handleSubmit} isLoading={submitting} />
            ) : (
              <p className="text-center text-foreground-secondary">Tenant not found</p>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
