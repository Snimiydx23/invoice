'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, List, Image, Layers } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Invoice Data Extraction',
    description:
      'Extract all key invoice fields — invoice number, date, vendor, subtotal, tax, total, due date, and payment terms — from any invoice format or layout. Works across languages and currencies.',
    highlights: [
      'Any layout, any vendor',
      'Multi-language support',
      'Currency detection',
      'Custom field extraction',
    ],
  },
  {
    icon: List,
    title: 'Invoice Line Extraction',
    description:
      'Go beyond header data and extract individual line items. Each product or service gets its own row with description, quantity, unit price, and line total.',
    highlights: [
      'Individual line items',
      'Quantity & unit price',
      'Multi-page line items',
      'Consistent column mapping',
    ],
  },
  {
    icon: Image,
    title: 'Image & Scan Support',
    description:
      'Works with scanned PDFs, photos of invoices, and low-quality images. OCR is built in — no pre-processing required.',
    highlights: [
      'Scanned PDF support',
      'Photo extraction',
      'Built-in OCR',
      'No pre-processing needed',
    ],
  },
  {
    icon: Layers,
    title: 'Additional Extraction Types',
    description:
      'Not just invoices. Extract data from receipts, purchase orders, delivery notes, bank statements, utility bills, and more — all with the same prompt-based approach.',
    highlights: [
      'Receipts & POs',
      'Bank statements',
      'Utility bills',
      'Payroll statements',
    ],
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What You Can{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              Extract
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From simple invoice headers to complex multi-page line items — 
            describe it once and extract at scale.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
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
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <feat.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feat.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {feat.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {feat.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {h}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
