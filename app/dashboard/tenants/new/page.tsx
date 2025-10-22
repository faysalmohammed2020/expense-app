"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { TenantForm } from "@/components/tenant-form"
import { useAuthStore } from "@/lib/auth-context"

export default function NewTenantPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create tenant")
      }

      router.push("/tenants")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
       

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Add Tenant</h1>
            <Link href="/tenants" className="btn-secondary px-6 py-3">
              Back to Tenants
            </Link>
          </div>

          <div className="card p-8">
            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            <TenantForm onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
