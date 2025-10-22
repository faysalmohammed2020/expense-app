"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuthStore } from "@/lib/auth-context"

interface BankAccount {
  id: string
  accountName: string
  bankName: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
}

export default function AccountsPage() {
  const { user } = useAuthStore()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/accounts", {
          headers: { "x-user-id": user.id },
        })
        const data = await response.json()
        setAccounts(data.accounts)
        setTotalBalance(data.totalBalance)
      } catch (error) {
        console.error("Error fetching accounts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return

    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "" },
      })

      if (response.ok) {
        setAccounts(accounts.filter((account) => account.id !== id))
      }
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
       

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Bank Accounts</h1>
            <Link href="/dashboard/accounts/new" className="btn-primary px-6 py-3">
              Add Account
            </Link>
          </div>

          {/* Total Balance Card */}
          <div className="card p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <p className="text-foreground-secondary text-sm">Total Balance</p>
            <p className="text-4xl font-bold text-primary mt-2">
              ৳ {totalBalance.toLocaleString("en-BD", { maximumFractionDigits: 2 })}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : accounts.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-foreground-secondary mb-4">No bank accounts added yet</p>
              <Link href="/dashboard/accounts/new" className="btn-primary px-6 py-3 inline-block">
                Add Your First Account
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{account.accountName}</h3>
                      <p className="text-foreground-secondary text-sm">{account.bankName}</p>
                    </div>
                    <span className="text-2xl">🏦</span>
                  </div>

                  <div className="border-t border-border pt-4 mb-4">
                    <p className="text-foreground-secondary text-sm">Account Number</p>
                    <p className="font-mono text-sm">****{account.accountNumber.slice(-4)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-foreground-secondary text-sm">Type</p>
                      <p className="font-semibold capitalize">{account.accountType}</p>
                    </div>
                    <div>
                      <p className="text-foreground-secondary text-sm">Currency</p>
                      <p className="font-semibold">{account.currency}</p>
                    </div>
                  </div>

                  <div className="bg-background-secondary p-4 rounded-lg mb-4">
                    <p className="text-foreground-secondary text-sm">Balance</p>
                    <p className="text-2xl font-bold text-primary">
                      {account.currency === "BDT" ? "৳" : account.currency === "USD" ? "$" : "₹"}{" "}
                      {account.balance.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/accounts/${account.id}`}
                      className="flex-1 btn-secondary px-4 py-2 text-center text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="flex-1 btn-secondary px-4 py-2 text-danger text-sm hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
