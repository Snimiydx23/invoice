import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

// AI Provider: Supports z-ai-web-dev-sdk (sandbox) and Google Gemini (production)
async function callVLM(extractionPrompt: string, base64Data: string, mimeType: string) {
  // Strategy 1: Try z-ai-web-dev-sdk (works in sandbox environment)
  if (!process.env.GEMINI_API_KEY) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()
      console.log('[Extract] Using z-ai-web-dev-sdk (sandbox mode)')

      const contentParts: Array<{ type: string; text?: string; image_url?: { url: string }; file_url?: { url: string } }> = [
        { type: 'text', text: extractionPrompt }
      ]

      if (mimeType === 'application/pdf') {
        contentParts.push({
          type: 'file_url',
          file_url: { url: `data:${mimeType};base64,${base64Data}` }
        })
      } else if (mimeType.startsWith('image/')) {
        contentParts.push({
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${base64Data}` }
        })
      }

      const response = await zai.chat.completions.createVision({
        messages: [{ role: 'user', content: contentParts }],
        thinking: { type: 'disabled' }
      })

      return response.choices[0]?.message?.content || ''
    } catch (err) {
      console.error('[Extract] z-ai-web-dev-sdk failed:', err)
      throw new Error('AI SDK failed. Set GEMINI_API_KEY environment variable for production use. Get your free key at https://aistudio.google.com/apikey')
    }
  }

  // Strategy 2: Google Gemini API (production - FREE: 1500 requests/day)
  console.log('[Extract] Using Google Gemini API (production mode)')
  const geminiApiKey = process.env.GEMINI_API_KEY

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
    { text: extractionPrompt }
  ]

  if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      }
    })
  }

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        }
      })
    }
  )

  if (!geminiResponse.ok) {
    const errText = await geminiResponse.text()
    console.error('[Extract] Gemini API error:', errText)
    throw new Error(`Gemini API error: ${geminiResponse.status}. Check your GEMINI_API_KEY.`)
  }

  const geminiData = await geminiResponse.json()
  const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return textContent
}

// LLM fallback for JSON structuring
async function callLLM(structuringPrompt: string) {
  // Try z-ai-web-dev-sdk first
  if (!process.env.GEMINI_API_KEY) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()
      const llmResponse = await zai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content: 'You are a data structuring assistant. Convert text into valid JSON array of objects. Return ONLY the JSON array, no markdown.'
          },
          { role: 'user', content: structuringPrompt }
        ],
        thinking: { type: 'disabled' }
      })
      return llmResponse.choices[0]?.message?.content || ''
    } catch {
      return ''
    }
  }

  // Gemini LLM fallback
  const geminiApiKey = process.env.GEMINI_API_KEY
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: 'You are a data structuring assistant. Convert text into valid JSON array of objects. Return ONLY the JSON array, no markdown.' },
            { text: structuringPrompt }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
      })
    }
  )

  if (!geminiResponse.ok) return ''
  const geminiData = await geminiResponse.json()
  return geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// Generate a simple unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const files = formData.getAll('files') as File[]

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required. Please describe what you want to extract.' },
        { status: 400 }
      )
    }

    console.log(`[Extract] Starting extraction with prompt: "${prompt.substring(0, 80)}..."`)
    console.log(`[Extract] Files received: ${files.length}`)

    const extractionId = generateId()

    // If no files uploaded, return demo data
    if (!files || files.length === 0) {
      console.log('[Extract] No files uploaded, returning demo data')
      const demoColumns = ['INVOICE #', 'DATE', 'VENDOR', 'AMOUNT', 'TAX', 'TOTAL', 'SOURCE FILE']
      const demoData = [
        { 'INVOICE #': 'INV-2025-001', DATE: '03/15/2025', VENDOR: 'Acme Corp', AMOUNT: '$1,250.00', TAX: '$125.00', TOTAL: '$1,375.00', 'SOURCE FILE': 'demo_invoice.pdf' },
        { 'INVOICE #': 'INV-2025-002', DATE: '03/16/2025', VENDOR: 'Tech Solutions', AMOUNT: '$3,500.00', TAX: '$350.00', TOTAL: '$3,850.00', 'SOURCE FILE': 'demo_invoice.pdf' },
        { 'INVOICE #': 'INV-2025-003', DATE: '03/17/2025', VENDOR: 'Office Direct', AMOUNT: '$890.00', TAX: '$89.00', TOTAL: '$979.00', 'SOURCE FILE': 'demo_invoice.pdf' },
      ]

      return NextResponse.json({
        id: extractionId,
        status: 'completed',
        columns: demoColumns,
        data: demoData,
      })
    }

    // Process files with AI (VLM)
    let allExtractedData: Record<string, string>[] = []

    try {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex]
        console.log(`[Extract] Processing file ${fileIndex + 1}/${files.length}: ${file.name} (${file.type}, ${file.size} bytes)`)

        const buffer = Buffer.from(await file.arrayBuffer())
        const base64Data = buffer.toString('base64')
        const mimeType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png')

        // Build the extraction prompt
        const extractionPrompt = `You are an expert invoice and document data extraction AI. Your job is to extract structured data from documents.

USER INSTRUCTIONS: ${prompt}

CRITICAL RULES:
1. Extract ONLY data that is actually visible in the document. Do NOT make up or hallucinate data.
2. If a field is not found in the document, use an empty string "" for that field.
3. Return the result as a JSON array of objects. Each object = one row of data.
4. For invoices: one row per invoice found.
5. For line items: one row per line item.
6. Be precise with numbers - include currency symbols exactly as shown in the document.
7. Dates should be in the format they appear in the document.
8. Always include a "SOURCE FILE" field with the value: "${file.name}"

RESPONSE FORMAT - Return ONLY a valid JSON array. No markdown, no explanation, just the JSON:
[
  {
    "FIELD_NAME": "extracted value",
    "SOURCE FILE": "${file.name}"
  }
]`

        // Call VLM (Vision Language Model)
        console.log(`[Extract] Calling VLM API for ${file.name}...`)
        const rawContent = await callVLM(extractionPrompt, base64Data, mimeType)

        console.log(`[Extract] VLM response length: ${rawContent.length} chars`)
        console.log(`[Extract] VLM response preview: ${rawContent.substring(0, 300)}...`)

        // Parse the JSON response from VLM
        let extractedRows: Record<string, string>[] = []

        // Try multiple JSON extraction strategies
        try {
          // Strategy 1: Try to find JSON array directly
          const jsonMatch = rawContent.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            extractedRows = JSON.parse(jsonMatch[0])
          }
        } catch (parseError1) {
          console.log('[Extract] Strategy 1 failed, trying LLM fallback...')

          // Strategy 2: Use LLM to restructure the VLM output
          try {
            const structuringPrompt = `Convert this extracted text into a JSON array of objects based on this prompt: "${prompt}"\n\nSource file: ${file.name}\n\nExtracted text:\n${rawContent}\n\nReturn ONLY a valid JSON array. Each object must have a "SOURCE FILE" field with value "${file.name}".`

            const llmContent = await callLLM(structuringPrompt)
            const llmJsonMatch = llmContent.match(/\[[\s\S]*\]/)
            if (llmJsonMatch) {
              extractedRows = JSON.parse(llmJsonMatch[0])
            }
          } catch (parseError2) {
            console.error('[Extract] LLM fallback also failed:', parseError2)
          }
        }

        // Ensure SOURCE FILE field
        extractedRows = extractedRows.map(row => ({
          ...row,
          'SOURCE FILE': row['SOURCE FILE'] || file.name,
        }))

        console.log(`[Extract] Extracted ${extractedRows.length} rows from ${file.name}`)
        allExtractedData = [...allExtractedData, ...extractedRows]
      }

      console.log(`[Extract] Total extracted rows: ${allExtractedData.length}`)
    } catch (aiError: any) {
      console.error('[Extract] AI processing error:', aiError?.message || aiError)
      return NextResponse.json(
        { error: `AI processing failed: ${aiError?.message || 'Unknown error'}. Please try again.` },
        { status: 500 }
      )
    }

    // If no data was extracted, return informative message
    if (allExtractedData.length === 0) {
      const infoColumns = ['INFO', 'PROMPT USED', 'SOURCE FILE']
      const infoData = [{
        INFO: 'No data could be extracted from the provided documents. This could mean the documents don\'t contain the requested data, or the files could not be read properly.',
        'PROMPT USED': prompt,
        'SOURCE FILE': files.map(f => f.name).join(', '),
      }]

      return NextResponse.json({
        id: extractionId,
        status: 'completed',
        columns: infoColumns,
        data: infoData,
      })
    }

    // Determine columns from the extracted data
    const columnSet = new Set<string>()
    allExtractedData.forEach(row => {
      Object.keys(row).forEach(key => columnSet.add(key))
    })
    const columns = Array.from(columnSet).filter(c => c !== 'SOURCE FILE')
    if (columnSet.has('SOURCE FILE')) {
      columns.push('SOURCE FILE')
    }

    console.log(`[Extract] Extraction complete: ${allExtractedData.length} rows, ${columns.length} columns`)

    return NextResponse.json({
      id: extractionId,
      status: 'completed',
      columns,
      data: allExtractedData,
    })
  } catch (error: any) {
    console.error('[Extract] Unhandled error:', error?.message || error)
    return NextResponse.json(
      { error: `Extraction failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
