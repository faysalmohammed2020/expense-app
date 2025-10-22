"use client"

import type React from "react"

import { useState } from "react"

interface IncomeFormProps {
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export function IncomeForm({ onSubmit, initialData, isLoading = false }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    amount: initialData?.amount || "",
    category: initialData?.category || "salary",
    source: initialData?.source || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    isRecurring: initialData?.isRecurring || false,
    recurringFrequency: initialData?.recurringFrequency || "monthly",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Monthly Salary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Optional description"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount (৳)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="business">Business</option>
            <option value="investment">Investment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Source</label>
        <input
          type="text"
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Company Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm font-medium">Recurring Income</span>
        </label>

        {formData.isRecurring && (
          <select
            name="recurringFrequency"
            value={formData.recurringFrequency}
            onChange={handleChange}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 font-semibold disabled:opacity-50">
        {isLoading ? "Saving..." : "Save Income"}
      </button>
    </form>
  )
}
