import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportData {
  monthlyIncome: number
  monthlyExpenses: number
  totalIncome: number
  totalExpenses: number
  bankBalance: number
  pendingRent: number
  monthlyBalance: number
  savingsRate?: number
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

export async function generateExpensesReport(data: ReportData, timeframe: string): Promise<Buffer> {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text('Expenses Report - Hisab360', 20, 30)
  
  // Timeframe
  doc.setFontSize(12)
  doc.text(`Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`, 20, 45)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55)
  
  // Summary
  doc.setFontSize(16)
  doc.text('Financial Summary', 20, 75)
  
  const summaryData = [
    ['Total Expenses', `৳ ${data.totalExpenses.toLocaleString()}`],
    ['Monthly Expenses', `৳ ${data.monthlyExpenses.toLocaleString()}`],
    ['Savings Rate', `${data.savingsRate?.toFixed(1)}%`],
  ]
  
  autoTable(doc, {
    startY: 80,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'grid',
  })
  
  // Expense Categories
  if (data.expenseCategories && data.expenseCategories.length > 0) {
    doc.setFontSize(16)
    doc.text('Expense by Category', 20, (doc as any).lastAutoTable.finalY + 20)
    
    const categoryData = data.expenseCategories.map(cat => [
      cat.category,
      `৳ ${cat.amount.toLocaleString()}`,
      `${cat.percentage.toFixed(1)}%`
    ])
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Category', 'Amount', 'Percentage']],
      body: categoryData,
      theme: 'grid',
    })
  }
  
  return Buffer.from(doc.output('arraybuffer'))
}

export async function generateIncomeReport(data: ReportData, timeframe: string): Promise<Buffer> {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text('Income Report - Hisab360', 20, 30)
  
  // Timeframe
  doc.setFontSize(12)
  doc.text(`Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`, 20, 45)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55)
  
  // Summary
  doc.setFontSize(16)
  doc.text('Income Summary', 20, 75)
  
  const summaryData = [
    ['Total Income', `৳ ${data.totalIncome.toLocaleString()}`],
    ['Monthly Income', `৳ ${data.monthlyIncome.toLocaleString()}`],
    ['Bank Balance', `৳ ${data.bankBalance.toLocaleString()}`],
  ]
  
  autoTable(doc, {
    startY: 80,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'grid',
  })
  
  // Income Sources
  if (data.incomeSources && data.incomeSources.length > 0) {
    doc.setFontSize(16)
    doc.text('Income by Source', 20, (doc as any).lastAutoTable.finalY + 20)
    
    const sourceData = data.incomeSources.map(source => [
      source.source,
      `৳ ${source.amount.toLocaleString()}`,
      `${source.percentage.toFixed(1)}%`
    ])
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Source', 'Amount', 'Percentage']],
      body: sourceData,
      theme: 'grid',
    })
  }
  
  return Buffer.from(doc.output('arraybuffer'))
}

export async function generateFullReport(data: ReportData, timeframe: string): Promise<Buffer> {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text('Complete Financial Report - Hisab360', 20, 30)
  
  // Add both expense and income content...
  // Implementation similar to above but combined
  
  return Buffer.from(doc.output('arraybuffer'))
}