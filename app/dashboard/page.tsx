"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { IncomeExpenseChart, ExpenseByCategoryChart, IncomeByCategoryChart } from "@/components/chart-container"
import { useAuthStore } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, Loader2 } from "lucide-react"

// Custom SVG Icons with gradient support
const TrendingUpIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 14-4-4-4 4-4-4"/>
    <path d="M12 6v13"/>
  </svg>
)

const TrendingDownIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 10 4 4 4-4 4 4"/>
    <path d="M12 18V5"/>
  </svg>
)

const BankIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="10" rx="2"/>
    <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
    <path d="M12 12v4"/>
    <path d="M2 14h20"/>
  </svg>
)

const HomeIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const AlertCircleIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y2="16"/>
  </svg>
)

const CalendarIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

interface DashboardStats {
  monthlyIncome: number
  monthlyExpenses: number
  totalIncome: number
  totalExpenses: number
  bankBalance: number
  pendingRent: number
  monthlyBalance: number
  savingsRate?: number
  lastUpdated?: string
  expenseCategories?: Array<{
    category: string
    amount: number
    percentage: number
  }>
  incomeSources?: Array<{
    source: string
    amount: number
    percentage: number
  }>
}

interface ReportData {
  type: 'expenses' | 'income' | 'full'
  timeframe: string
  data: any
  generatedAt: string
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTimeframe, setActiveTimeframe] = useState("monthly")
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/dashboard/stats", {
          headers: { "x-user-id": user.id },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`)
        }

        const data = await response.json()
        
        // Calculate savings rate if not provided by API
        const savingsRate = data.savingsRate ?? 
          (data.monthlyIncome > 0 
            ? ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100 
            : 0)
        
        // Add calculated fields
        setStats({
          ...data,
          savingsRate,
          lastUpdated: data.lastUpdated || new Date().toISOString()
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("Unable to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  const formatCurrency = (amount: number) => {
    return `৳ ${amount?.toLocaleString("en-BD") || "0"}`
  }

  const formatPercentage = (value: number | undefined) => {
    const safeValue = value || 0
    return `${safeValue > 0 ? "+" : ""}${safeValue.toFixed(1)}%`
  }

  const getSavingsRateColor = (rate: number | undefined) => {
    const safeRate = rate || 0
    if (safeRate >= 20) return "text-green-600"
    if (safeRate >= 10) return "text-yellow-600"
    return "text-red-600"
  }

  const calculateMonthlyBalance = (stats: DashboardStats | null) => {
    if (!stats) return 0
    return (stats.monthlyIncome || 0) - (stats.monthlyExpenses || 0)
  }

  const getTrendValue = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const generatePDFReport = async (reportType: 'expenses' | 'income' | 'full') => {
    if (!stats) return

    try {
      setGeneratingReport(reportType)
      
      const reportData: ReportData = {
        type: reportType,
        timeframe: activeTimeframe,
        data: stats,
        generatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      // Get the PDF blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      // Set filename based on report type and date
      const date = new Date().toISOString().split('T')[0]
      const filename = `hisab360-${reportType}-report-${date}.pdf`
      a.download = filename
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (error) {
      console.error('Error generating report:', error)
      setError('Failed to generate report. Please try again.')
    } finally {
      setGeneratingReport(null)
    }
  }

  // Quick report generation functions
  const generateExpensesReport = () => generatePDFReport('expenses')
  const generateIncomeReport = () => generatePDFReport('income')
  const generateFullReport = () => generatePDFReport('full')

  if (error) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert variant="destructive" className="border-l-4 border-l-red-500">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header with Context */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Financial Dashboard
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {stats?.lastUpdated ? `Last updated ${new Date(stats.lastUpdated).toLocaleDateString()}` : "Real-time financial overview"}
                </p>
              </div>
              
              {/* Report Generation Buttons */}
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                {/* Timeframe Selector */}
                <Tabs value={activeTimeframe} onValueChange={setActiveTimeframe} className="w-auto">
                  <TabsList className="grid w-full grid-cols-3 lg:w-80">
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Report Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={generateExpensesReport}
                    disabled={!stats || generatingReport !== null}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {generatingReport === 'expenses' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Expenses PDF
                  </Button>
                  
                  <Button
                    onClick={generateIncomeReport}
                    disabled={!stats || generatingReport !== null}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {generatingReport === 'income' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Income PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Health Overview */}
          {stats && (
            <section className="mb-8">
              <Card className="border-l-4 border-l-blue-500 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Financial Health</h2>
                      <p className="text-muted-foreground text-sm">
                        Your current financial standing and progress
                      </p>
                    </div>
                    <div className="mt-4 lg:mt-0 flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {formatCurrency(calculateMonthlyBalance(stats))}
                        </div>
                        <div className="text-xs text-muted-foreground">Net Balance</div>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getSavingsRateColor(stats.savingsRate)}`}>
                          {formatPercentage(stats.savingsRate)}
                        </div>
                        <div className="text-xs text-muted-foreground">Savings Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Enhanced Stats Grid with Glass Morphism */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Key Metrics</h2>
              <Badge variant="secondary" className="font-normal">
                {activeTimeframe.charAt(0).toUpperCase() + activeTimeframe.slice(1)} View
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="bg-background/50 backdrop-blur-sm border border-border/50">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : stats ? (
                <>
                  <StatCard
                    label="Monthly Income"
                    value={formatCurrency(stats.monthlyIncome)}
                    subtitle="Primary income sources"
                    icon={<TrendingUpIcon className="h-6 w-6" />}
                    color="success"
                    trend="positive"
                    trendValue={getTrendValue(stats.monthlyIncome, stats.totalIncome / 12)}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 border-l-4 border-l-green-500"
                  />
                  <StatCard
                    label="Monthly Expenses"
                    value={formatCurrency(stats.monthlyExpenses)}
                    subtitle="All categories"
                    icon={<TrendingDownIcon className="h-6 w-6" />}
                    color="danger"
                    trend="negative"
                    trendValue={getTrendValue(stats.monthlyExpenses, stats.totalExpenses / 12)}
                    className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/10 border-l-4 border-l-red-500"
                  />
                  <StatCard
                    label="Bank Balance"
                    value={formatCurrency(stats.bankBalance)}
                    subtitle="Available funds"
                    icon={<BankIcon className="h-6 w-6" />}
                    color="primary"
                    trend="neutral"
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/10 border-l-4 border-l-blue-500"
                  />
                  <StatCard
                    label="Pending Rent"
                    value={formatCurrency(stats.pendingRent)}
                    subtitle="Due next week"
                    icon={<HomeIcon className="h-6 w-6" />}
                    color="warning"
                    trend="warning"
                    className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/10 border-l-4 border-l-amber-500"
                  />
                </>
              ) : null}
            </div>
          </section>

          {/* Interactive Charts Section */}
          <section className="space-y-12">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 lg:w-96">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {loading ? (
                    <>
                      <Skeleton className="h-80 w-full rounded-xl" />
                      <Skeleton className="h-80 w-full rounded-xl" />
                    </>
                  ) : (
                    <>
                      <Card className="border border-border/50 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                            Income vs Expenses
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <IncomeExpenseChart />
                        </CardContent>
                      </Card>
                      <Card className="border border-border/50 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingDownIcon className="h-5 w-5 text-red-600" />
                            Spending by Category
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ExpenseByCategoryChart />
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="expenses">
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Expense Analysis</span>
                      <Button
                        onClick={generateExpensesReport}
                        disabled={!stats || generatingReport !== null}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {generatingReport === 'expenses' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        Generate PDF
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-80 w-full rounded-lg" />
                    ) : (
                      <ExpenseByCategoryChart />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="income">
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Income Breakdown</span>
                      <Button
                        onClick={generateIncomeReport}
                        disabled={!stats || generatingReport !== null}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {generatingReport === 'income' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Generate PDF
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-80 w-full rounded-lg" />
                    ) : (
                      <IncomeByCategoryChart />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Quick Actions Footer */}
          {!loading && (
            <section className="mt-12 pt-8 border-t border-border/50">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                  Add Transaction
                </button>
                
                <Button
                  onClick={generateFullReport}
                  disabled={!stats || generatingReport !== null}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {generatingReport === 'full' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  Generate Full Report
                </Button>
                
                <button className="px-6 py-3 border border-border hover:bg-accent rounded-lg font-medium transition-colors duration-200">
                  Set Budget
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}