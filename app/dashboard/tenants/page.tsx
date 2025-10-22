"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth-context"

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  rentAmount: number
  rentDueDate: number
  leaseStartDate: string
  leaseEndDate: string | null
}

export default function TenantsPage() {
  const { user } = useAuthStore()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchTenants = async () => {
      try {
        const response = await fetch(`/api/tenants?page=${page}&limit=10`, {
          headers: { "x-user-id": user.id },
        })
        const data = await response.json()
        setTenants(data.tenants)
        setTotal(data.total)
      } catch (error) {
        console.error("Error fetching tenants:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenants()
  }, [user, page])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return

    try {
      const response = await fetch(`/api/tenants/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "" },
      })

      if (response.ok) {
        setTenants(tenants.filter((tenant) => tenant.id !== id))
      }
    } catch (error) {
      console.error("Error deleting tenant:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <Link href="/tenants/new" className="btn-primary px-6 py-3">
          Add Tenant
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : tenants.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-foreground-secondary mb-4">No tenants added yet</p>
          <Link href="/dashboard/tenants/new" className="btn-primary px-6 py-3 inline-block">
            Add Your First Tenant
          </Link>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Monthly Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-border hover:bg-background-secondary">
                    <td className="px-6 py-4 font-semibold">{tenant.name}</td>
                    <td className="px-6 py-4 text-sm">{tenant.email || "-"}</td>
                    <td className="px-6 py-4 text-sm">{tenant.phone || "-"}</td>
                    <td className="px-6 py-4 font-semibold">৳ {tenant.rentAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">Day {tenant.rentDueDate}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link href={`/dashboard/tenants/${tenant.id}`} className="text-primary hover:underline text-sm">
                        View
                      </Link>
                      <Link href={`/dashboard/tenants/${tenant.id}/edit`} className="text-primary hover:underline text-sm">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(tenant.id)} className="text-danger hover:underline text-sm">
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
