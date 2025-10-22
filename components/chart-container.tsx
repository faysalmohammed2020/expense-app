"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function IncomeExpenseChart() {
  const { user } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/chart-data?period=month", {
          headers: { "x-user-id": user.id },
        })
        const result = await response.json()
        setData(result.dailyTrend || [])
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) return <div className="card p-6 h-80 flex items-center justify-center">Loading...</div>

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#2563eb" />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ExpenseByCategoryChart() {
  const { user } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/chart-data?period=month", {
          headers: { "x-user-id": user.id },
        })
        const result = await response.json()
        setData(result.expensesByCategory || [])
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) return <div className="card p-6 h-80 flex items-center justify-center">Loading...</div>

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function IncomeByCategoryChart() {
  const { user } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/chart-data?period=month", {
          headers: { "x-user-id": user.id },
        })
        const result = await response.json()
        setData(result.incomeByCategory || [])
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) return <div className="card p-6 h-80 flex items-center justify-center">Loading...</div>

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Income by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
