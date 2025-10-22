"use client"

import type React from "react"

import { useState } from "react"

interface AccountFormProps {
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export function AccountForm({ onSubmit, initialData, isLoading = false }: AccountFormProps) {
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || "",
    bankName: initialData?.bankName || "",
    accountNumber: initialData?.accountNumber || "",
    accountType: initialData?.accountType || "savings",
    balance: initialData?.balance || "",
    currency: initialData?.currency || "BDT",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Account Name</label>
        <input
          type="text"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., My Savings Account"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bank Name</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Dhaka Bank"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Account Number</label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Account number (last 4 digits recommended)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="BDT">BDT (৳)</option>
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Current Balance</label>
        <input
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
          step="0.01"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="0.00"
        />
      </div>

      <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 font-semibold disabled:opacity-50">
        {isLoading ? "Saving..." : "Save Account"}
      </button>
    </form>
  )
}
