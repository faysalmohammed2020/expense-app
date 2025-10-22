"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuthStore } from "@/lib/auth-context"

interface RentPayment {
  id: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: string
  paymentMethod: string | null
}

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  address: string
  rentAmount: number
  rentDueDate: number
  leaseStartDate: string
  leaseEndDate: string | null
  rentPayments: RentPayment[]
}

export default function TenantDetailPage() {
  const params = useParams()
  const { user } = useAuthStore()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

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
      } catch (error) {
        console.error("Error fetching tenant:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenant()
  }, [user, params.id])

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="text-center py-8">Loading...</div>
        </main>
      </ProtectedRoute>
    )
  }

  if (!tenant) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="text-center py-8">Tenant not found</div>
        </main>
      </ProtectedRoute>
    )
  }

  const pendingPayments = tenant.rentPayments.filter((p) => p.status === "pending")
  const paidPayments = tenant.rentPayments.filter((p) => p.status === "paid")

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{tenant.name}</h1>
            <Link href={`/tenants/${tenant.id}/edit`} className="btn-primary px-6 py-3">
              Edit Tenant
            </Link>
          </div>

          {/* Tenant Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-foreground-secondary text-sm">Email</p>
                  <p className="font-medium">{tenant.email || "-"}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary text-sm">Phone</p>
                  <p className="font-medium">{tenant.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary text-sm">Address</p>
                  <p className="font-medium">{tenant.address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Lease Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-foreground-secondary text-sm">Monthly Rent</p>
                  <p className="text-2xl font-bold text-primary">৳ {tenant.rentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary text-sm">Due Date</p>
                  <p className="font-medium">Day {tenant.rentDueDate} of each month</p>
                </div>
                <div>
                  <p className="text-foreground-secondary text-sm">Lease Period</p>
                  <p className="font-medium">
                    {new Date(tenant.leaseStartDate).toLocaleDateString()} -{" "}
                    {tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString() : "Ongoing"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Payments */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Rent Payment History</h3>

            {tenant.rentPayments.length === 0 ? (
              <p className="text-foreground-secondary">No rent payments recorded</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Due Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Paid Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.rentPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border hover:bg-background-secondary">
                        <td className="px-4 py-3">{new Date(payment.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-semibold">৳ {payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              payment.status === "paid"
                                ? "bg-success/10 text-success"
                                : payment.status === "pending"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-danger/10 text-danger"
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-3 capitalize">{payment.paymentMethod?.replace("_", " ") || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
