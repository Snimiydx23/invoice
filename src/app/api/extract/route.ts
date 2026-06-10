import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

// AI Provider: Uses Claude (Anthropic) API for production
async function callVLM(extractionPrompt: string, base64Data: string, mimeType: string) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY

  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set. Please add it in Render dashboard.')
  }

  console.log('[Extract] Using Claude (Anthropic) API')

  const contentParts: Array<Record<string, unknown>> = [
    { type: 'text', text: extractionPrompt }
  ]

  if (mimeType === 'application/pdf') {
    contentParts.push({
      type: 'document',
      source: {
        type: 'base64',
        media_type: 'application/pdf',
        data: base64Data,
      }
    })
  } else if (mimeType.startsWith('image/')) {
    contentParts.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mimeType,
        data: base64Data,
      }
    })
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: contentParts,
        }
      ]
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('[Extract] Claude API error:', errText)
    throw new Error(`Claude API error: ${response.status}. Check your ANTHROPIC_API_KEY.`)
  }

  const data = await response.json()
  const textContent = data.content?.find((b: { type: string }) => b.type === 'text')?.text || ''
  return textContent
}

// LLM fallback for JSON structuring using Claude
async function callLLM(structuringPrompt: string) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicApiKey) return ''

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      system: 'You are a data structuring assistant. Convert text into valid JSON array of objects. Return ONLY the JSON array, no markdown, no explanation.',
      messages: [{ role: 'user', content: structuringPrompt }]
    })
  })

  if (!response.ok) return ''
  const data = await response.json()
  return data.content?.find((b: { type: string }) => b.type === 'text')?.text || ''
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
        console.log(`[Extract] Calling Claude API for ${file.name}...`)
        const rawContent = await callVLM(extractionPrompt, base64Data, mimeType)

        console.log(`[Extract] Claude response length: ${rawContent.length} chars`)
        console.log(`[Extract] Claude response preview: ${rawContent.substring(0, 300)}...`)

        // Parse the JSON response
        let extractedRows: Record<string, string>[] = []

        try {
          const jsonMatch = rawContent.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            extractedRows = JSON.parse(jsonMatch[0])
          }
        } catch (parseError1) {
          console.log('[Extract] Strategy 1 failed, trying LLM fallback...')

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
    } catch (aiError: unknown) {
      const msg = aiError instanceof Error ? aiError.message : 'Unknown error'
      console.error('[Extract] AI processing error:', msg)
      return NextResponse.json(
        { error: `AI processing failed: ${msg}. Please try again.` },
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Extract] Unhandled error:', msg)
    return NextResponse.json(
      { error: `Extraction failed: ${msg}` },
      { status: 500 }
    )
  }
}
