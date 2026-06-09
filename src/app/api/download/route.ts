import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { columns, data, format } = body as {
      columns: string[]
      data: Record<string, string>[]
      format: string
    }

    if (!columns || !data || !format) {
      return NextResponse.json(
        { error: 'columns, data, and format are required' },
        { status: 400 }
      )
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="extracted_invoices.json"',
        },
      })
    }

    if (format === 'csv') {
      const csvHeader = columns.join(',')
      const csvRows = data.map((row) =>
        columns.map((col) => `"${(row[col] || '').replace(/"/g, '""')}"`).join(',')
      )
      const csv = [csvHeader, ...csvRows].join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="extracted_invoices.csv"',
        },
      })
    }

    // xlsx format
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(data, { header: columns })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Extraction')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buf, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="extracted_invoices.xlsx"',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
}
