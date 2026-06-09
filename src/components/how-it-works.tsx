'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowRight, FileSpreadsheet, Columns, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: FileSpreadsheet,
    title: 'Native Excel Types',
    description:
      'Dates are dates, numbers are numbers, currency is currency. No more text-formatted cells that break your formulas.',
  },
  {
    icon: Columns,
    title: 'Consistent Formatting',
    description:
      'The same columns appear in the same order every time. Your downstream processes can rely on a stable schema.',
  },
  {
    icon: CheckCircle2,
    title: 'Easy Verification',
    description:
      'Source file references link every row back to the original document so you can verify any extraction instantly.',
  },
]

const samplePrompt = `Extract from each invoice:
- Invoice number
- Invoice date
- Vendor name
- Subtotal (amount before tax)
- Tax amount
- Total amount
- Currency
- Due date
- Payment terms`

const sampleResult = [
  { invoice: 'INV-2401', date: '2025-01-15', vendor: 'Acme Corp', amount: '$1,200.00', tax: '$120.00', total: '$1,320.00' },
  { invoice: 'INV-2402', date: '2025-01-18', vendor: 'TechSupply', amount: '$3,450.00', tax: '$345.00', total: '$3,795.00' },
  { invoice: 'INV-2403', date: '2025-02-02', vendor: 'GlobalSvc', amount: '$890.00', tax: '$89.00', total: '$979.00' },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From prompt to{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              spreadsheet
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe your extraction once, then run it on thousands of documents 
            with perfectly consistent output.
          </p>
        </motion.div>

        {/* Two column: Prompt → Spreadsheet */}
        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Left: Prompt */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                YOUR PROMPT
              </div>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
              {samplePrompt}
            </pre>
          </div>

          {/* Right: Arrow + Spreadsheet */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                YOUR SPREADSHEET
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">INVOICE #</TableHead>
                    <TableHead className="text-xs">DATE</TableHead>
                    <TableHead className="text-xs">VENDOR</TableHead>
                    <TableHead className="text-xs">AMOUNT</TableHead>
                    <TableHead className="text-xs">TAX</TableHead>
                    <TableHead className="text-xs">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleResult.map((row) => (
                    <TableRow key={row.invoice}>
                      <TableCell className="font-mono text-xs">{row.invoice}</TableCell>
                      <TableCell className="text-xs">{row.date}</TableCell>
                      <TableCell className="text-xs">{row.vendor}</TableCell>
                      <TableCell className="text-xs tabular-nums">{row.amount}</TableCell>
                      <TableCell className="text-xs tabular-nums">{row.tax}</TableCell>
                      <TableCell className="text-xs font-medium tabular-nums">{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <feat.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-1 font-semibold">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
