'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  List,
  DollarSign,
  Receipt,
  Package,
  Landmark,
  PackageSearch,
  CreditCard,
  Zap,
} from 'lucide-react'

const docTypes = [
  {
    icon: FileText,
    title: 'Invoices & Credit Notes',
    description: 'Extract invoice numbers, dates, vendors, amounts, and line items from any invoice format.',
  },
  {
    icon: List,
    title: 'Line Items',
    description: 'Pull individual products and services with quantities, unit prices, and totals.',
  },
  {
    icon: DollarSign,
    title: 'Payroll',
    description: 'Extract employee payment data, deductions, gross and net pay from payroll statements.',
  },
  {
    icon: Receipt,
    title: 'Tax Data',
    description: 'VAT, GST, and Sales Tax amounts with tax IDs and calculation breakdowns.',
  },
  {
    icon: Package,
    title: 'Invoice Packets',
    description: 'Combine invoice, purchase order, and delivery note data from multi-document packets.',
  },
  {
    icon: Landmark,
    title: 'Financial Statements',
    description: 'Bank and card statements with transaction details, balances, and dates.',
  },
  {
    icon: PackageSearch,
    title: 'Inventory',
    description: 'Stock and product lists with SKU codes, quantities, descriptions, and pricing.',
  },
  {
    icon: CreditCard,
    title: 'Receipts',
    description: 'Expense confirmations with merchant, amount, date, and category information.',
  },
  {
    icon: Zap,
    title: 'Utility Bills',
    description: 'Electric, gas, and telecom bills with consumption data, rates, and charges.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function DocumentTypes() {
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
            Works with any document type —{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              just describe what to extract
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No templates. No training. Just describe the data you need and the AI
            handles the rest.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {docTypes.map((doc) => (
            <motion.div key={doc.title} variants={cardVariants}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <doc.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-1 font-semibold">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
