'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  FileText,
  Loader2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ImageIcon,
  FileUp,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

interface UploadedFile {
  id: string
  file: File
  name: string
  size: string
  type: string
}

interface ExtractionResult {
  id: string
  status: string
  columns: string[]
  data: Record<string, string>[]
}

const samplePrompts = [
  'Extract invoice number, date, vendor, amount, tax, and total from each invoice',
  'Get vendor name, invoice date, and total amount from all invoices',
  'Extract line items with product description, quantity, unit price, and total',
  'Pull invoice number, due date, payment terms, and balance due',
]

export function ExtractionTool() {
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to results when extraction completes
  useEffect(() => {
    if (status === 'done' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png']

    const filtered = fileArray.filter((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase()
      const isAllowedType = f.type === 'application/pdf' || f.type.startsWith('image/')
      const isAllowedExt = allowedExtensions.includes(ext)
      return isAllowedType || isAllowedExt
    })

    if (filtered.length < fileArray.length) {
      toast({
        title: 'Some files were skipped',
        description: 'Only PDF, JPG, and PNG files are supported.',
        variant: 'destructive',
      })
    }

    if (filtered.length === 0 && fileArray.length > 0) {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload PDF, JPG, or PNG files only.',
        variant: 'destructive',
      })
      return
    }

    const mapped: UploadedFile[] = filtered.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      name: f.name,
      size: formatFileSize(f.size),
      type: f.type || (f.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
    }))

    setFiles((prev) => [...prev, ...mapped])
  }, [toast])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  const handleExtract = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Please enter a prompt',
        description: 'Describe what you would like to extract from the documents.',
        variant: 'destructive',
      })
      return
    }

    setStatus('uploading')
    setProgress(10)
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('prompt', prompt)
      files.forEach((f) => {
        formData.append('files', f.file)
      })

      setStatus('extracting')
      setProgress(20)

      // Simulate progress while waiting for AI
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval)
            return 85
          }
          return prev + Math.random() * 8
        })
      }, 800)

      // ✅ FIX: Seedha Render backend pe call — Vercel proxy se 413 aata tha
      // Vercel free plan mein /api/extract route pe 4.5MB hard limit hai
      // Is liye frontend se directly Render URL pe bhejte hain
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://invoice-api-server.onrender.com'
      const res = await fetch(`${BACKEND_URL}/api/extract`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Extraction failed' }))
        throw new Error(errorData.error || 'Extraction failed')
      }

      const data: ExtractionResult = await res.json()
      setProgress(100)
      setResult(data)
      setStatus('done')

      toast({
        title: 'Extraction complete!',
        description: `Successfully extracted ${data.data.length} rows from your documents.`,
      })
    } catch (err: any) {
      setStatus('error')
      setProgress(0)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      toast({
        title: 'Extraction failed',
        description: err.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = async (format: string) => {
    if (!result) return

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columns: result.columns,
          data: result.data,
          format,
        }),
      })
      if (!res.ok) throw new Error('Download failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `extracted_invoices.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Download started',
        description: `Your file is being downloaded as .${format}`,
      })
    } catch {
      toast({
        title: 'Download failed',
        description: 'Could not download the file. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleReset = () => {
    setPrompt('')
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setResult(null)
    setErrorMsg('')
    // Scroll to top of extraction tool
    document.getElementById('extraction')?.scrollIntoView({ behavior: 'smooth' })
  }

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />
    return <ImageIcon className="h-4 w-4 text-blue-500" />
  }

  // Show results table
  if (status === 'done' && result) {
    return (
      <div id="extraction" ref={resultRef} className="mx-auto max-w-5xl scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="p-6">
              {/* Success header */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Extraction Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.data.length} row{result.data.length !== 1 ? 's' : ''} extracted
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('xlsx')}
                    className="gap-1.5"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    .xlsx
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('csv')}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    .csv
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload('json')}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    .json
                  </Button>
                </div>
              </div>

              {/* Prompt display */}
              <div className="mb-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">YOUR PROMPT</p>
                <p className="text-sm">{prompt}</p>
              </div>

              {/* Results table */}
              <div className="max-h-96 overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {result.columns.map((col) => (
                        <TableHead key={col} className="text-xs font-bold uppercase whitespace-nowrap">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.data.map((row, i) => (
                      <TableRow key={i}>
                        {result.columns.map((col) => (
                          <TableCell key={col} className="text-sm whitespace-nowrap">
                            {row[col] ?? '—'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Download as .xlsx, .csv, or .json for use in Excel, accounting software, or ERP systems.
                </p>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  New Extraction
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div id="extraction" className="mx-auto max-w-3xl scroll-mt-20">
      <Card className="shadow-lg border-2 border-emerald-100 dark:border-emerald-900/50">
        <CardContent className="p-6">
          {/* Prompt */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              What would you like to extract?
            </label>
            <Textarea
              placeholder="e.g., Extract invoice number, date, vendor, amount, tax, and total from each invoice"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none text-base"
              disabled={status === 'uploading' || status === 'extracting'}
            />
            {/* Quick prompt suggestions */}
            {!prompt && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {samplePrompts.map((sp, i) => (
                  <button
                    key={i}
                    type="button"
                    className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setPrompt(sp)}
                  >
                    {sp.substring(0, 50)}...
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File upload area */}
          <div
            className={`relative mb-4 rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 scale-[1.01]'
                : files.length > 0
                ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800/50 dark:bg-emerald-900/10'
                : 'border-muted-foreground/25 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files)
                e.target.value = ''
              }}
              disabled={status === 'uploading' || status === 'extracting'}
            />
            <div className="flex flex-col items-center gap-2">
              <div className={`rounded-full p-3 transition-colors ${dragActive ? 'bg-emerald-100 dark:bg-emerald-800/30' : 'bg-muted'}`}>
                <FileUp className={`h-6 w-6 ${dragActive ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or{' '}
                <button
                  type="button"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={status === 'uploading' || status === 'extracting'}
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, JPG, PNG — up to 5,000 pages per file
              </p>
            </div>
          </div>

          {/* File chips */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                className="mb-4 flex flex-wrap gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {files.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 py-1.5 pr-1.5"
                    >
                      {getFileIcon(f.type)}
                      <span className="max-w-[150px] truncate">{f.name}</span>
                      <span className="text-muted-foreground">({f.size})</span>
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        disabled={status === 'uploading' || status === 'extracting'}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground hover:border-emerald-400 hover:text-emerald-600"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={status === 'uploading' || status === 'extracting'}
                >
                  + Add more
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          {(status === 'uploading' || status === 'extracting') && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span className="font-medium">
                  {status === 'uploading'
                    ? 'Uploading files...'
                    : 'Extracting data with AI...'}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                {progress < 30
                  ? 'Reading your documents...'
                  : progress < 60
                  ? 'Analyzing document structure...'
                  : progress < 85
                  ? 'Extracting data fields...'
                  : 'Almost done...'}
              </p>
            </motion.div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <motion.div
              className="mb-4 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Extraction failed</p>
                <p className="text-xs mt-0.5 opacity-80">{errorMsg}</p>
              </div>
            </motion.div>
          )}

          {/* Extract button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {files.length > 0
                ? `${files.length} file${files.length !== 1 ? 's' : ''} ready · `
                : ''}
              Unlimited pages free every month
            </p>
            <Button
              size="lg"
              onClick={handleExtract}
              disabled={status === 'uploading' || status === 'extracting' || !prompt.trim()}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 min-w-[140px]"
            >
              {status === 'uploading' || status === 'extracting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Extract
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
