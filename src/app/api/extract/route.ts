import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

// ─── Render Backend URL (hardcoded) ───────────────────────────────────────
const RENDER_API_URL = "https://invoice-api-server.onrender.com"
// ^^^ Render deploy hone ke baad yahan apna actual URL dalo

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    console.log(`[Proxy] Forwarding to: ${RENDER_API_URL}/api/extract`)

    const backendResponse = await fetch(`${RENDER_API_URL}/api/extract`, {
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
