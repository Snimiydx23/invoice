import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

// ✅ FIX: 413 error fix — Next.js API route body size limit badhaya
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
    responseLimit: false,
  },
}

// ─── Render Backend URL (hardcoded) ───────────────────────────────────────
const RENDER_API_URL = "https://invoice-api-server.onrender.com"
// ^^^ Render deploy hone ke baad yahan apna actual URL dalo

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    console.log(`[Proxy] Forwarding to: ${RENDER_API_URL}/api/extract`)

    const backendResponse = await fetch('https://invoice-api-server.onrender.com/api/extract', {
      method: 'POST',
      body: formData,
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    return NextResponse.json(data)

  } catch (error: any) {
    return NextResponse.json(
      { error: `Extraction server unreachable: ${error?.message}` },
      { status: 502 }
    )
  }
}
