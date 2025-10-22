"use client"

import type React from "react"
import { useAuthStore } from "@/lib/auth-context"
import { useState } from "react"

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    language: "en",
    currency: "BDT",
    timezone: "Asia/Dhaka",
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {saved && (
          <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg mb-6">
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="bn">Bengali</option>
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

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Asia/Dhaka">Asia/Dhaka</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <button type="submit" className="w-full btn-primary py-3 font-semibold">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  )
}
