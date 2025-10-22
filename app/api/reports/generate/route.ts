import { NextRequest, NextResponse } from 'next/server'
import { generateExpensesReport, generateIncomeReport, generateFullReport } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, timeframe, data } = body

    let pdfBuffer: Buffer

    switch (type) {
      case 'expenses':
        pdfBuffer = await generateExpensesReport(data, timeframe)
        break
      case 'income':
        pdfBuffer = await generateIncomeReport(data, timeframe)
        break
      case 'full':
        pdfBuffer = await generateFullReport(data, timeframe)
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${type}-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}