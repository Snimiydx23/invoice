'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileSpreadsheet } from 'lucide-react'

const sampleData = [
  { invoice: 'INV-2024-001', date: '2025-01-15', vendor: 'Acme Corp', amount: '$1,200.00', tax: '$120.00', total: '$1,320.00', source: 'invoice_jan.pdf' },
  { invoice: 'INV-2024-002', date: '2025-01-18', vendor: 'TechSupply Ltd', amount: '$3,450.00', tax: '$345.00', total: '$3,795.00', source: 'techsupply.pdf' },
  { invoice: 'INV-2024-003', date: '2025-02-02', vendor: 'Global Services', amount: '$890.00', tax: '$89.00', total: '$979.00', source: 'global_svc.pdf' },
  { invoice: 'INV-2024-004', date: '2025-02-10', vendor: 'OfficePro Inc', amount: '$2,150.00', tax: '$215.00', total: '$2,365.00', source: 'officepro.pdf' },
  { invoice: 'INV-2024-005', date: '2025-02-22', vendor: 'CloudNet Systems', amount: '$5,600.00', tax: '$560.00', total: '$6,160.00', source: 'cloudnet.pdf' },
  { invoice: 'INV-2024-006', date: '2025-03-05', vendor: 'DataViz Analytics', amount: '$1,780.00', tax: '$178.00', total: '$1,958.00', source: 'dataviz.pdf' },
  { invoice: 'INV-2024-007', date: '2025-03-12', vendor: 'SecureIT Solutions', amount: '$4,320.00', tax: '$432.00', total: '$4,752.00', source: 'secureit.pdf' },
]

const columns = ['INVOICE #', 'DATE', 'VENDOR', 'AMOUNT', 'TAX', 'TOTAL', 'SOURCE FILE']

export function SampleOutput() {
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
            What you get:{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              Clean, structured spreadsheets
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Define your columns and rules once, then run them across every file. 
            Same headers, same types, same order — every time.
          </p>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-xl border bg-card shadow-sm">
            {/* File header */}
            <div className="flex items-center justify-between border-b px-6 py-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">extracted_invoices.xlsx</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">.xlsx</Badge>
                <Badge variant="secondary" className="text-xs">.csv</Badge>
                <Badge variant="secondary" className="text-xs">.json</Badge>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col} className="px-4 text-xs font-semibold uppercase tracking-wider">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((row) => (
                    <TableRow key={row.invoice}>
                      <TableCell className="px-4 font-mono text-sm">{row.invoice}</TableCell>
                      <TableCell className="px-4 text-sm">{row.date}</TableCell>
                      <TableCell className="px-4 text-sm">{row.vendor}</TableCell>
                      <TableCell className="px-4 text-sm tabular-nums">{row.amount}</TableCell>
                      <TableCell className="px-4 text-sm tabular-nums">{row.tax}</TableCell>
                      <TableCell className="px-4 font-medium text-sm tabular-nums">{row.total}</TableCell>
                      <TableCell className="px-4 text-sm text-muted-foreground">{row.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
