"use client"

import type React from "react"

import { useState } from "react"

interface TenantFormProps {
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export function TenantForm({ onSubmit, initialData, isLoading = false }: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    rentAmount: initialData?.rentAmount || "",
    rentDueDate: initialData?.rentDueDate || "1",
    leaseStartDate: initialData?.leaseStartDate
      ? new Date(initialData.leaseStartDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    leaseEndDate: initialData?.leaseEndDate ? new Date(initialData.leaseEndDate).toISOString().split("T")[0] : "",
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
        <label className="block text-sm font-medium mb-2">Tenant Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Full name"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="tenant@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+880..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Property address"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Rent (৳)</label>
          <input
            type="number"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rent Due Date (Day of Month)</label>
          <select
            name="rentDueDate"
            value={formData.rentDueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Lease Start Date</label>
          <input
            type="date"
            name="leaseStartDate"
            value={formData.leaseStartDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lease End Date (Optional)</label>
          <input
            type="date"
            name="leaseEndDate"
            value={formData.leaseEndDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 font-semibold disabled:opacity-50">
        {isLoading ? "Saving..." : "Save Tenant"}
      </button>
    </form>
  )
}
