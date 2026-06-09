'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Calculator, TrendingUp, User } from 'lucide-react'

const roles = [
  {
    icon: Building2,
    title: 'For Accounts Payable Departments',
    features: [
      'Batch-process hundreds of vendor invoices in minutes',
      'Auto-capture invoice numbers, PO references, and payment terms',
      'Reduce manual data entry errors by up to 95%',
    ],
  },
  {
    icon: Calculator,
    title: 'For Accountants & Bookkeepers',
    features: [
      'Extract line items with consistent categories across clients',
      'Import directly into Xero, QuickBooks, and Sage',
      'Handle multi-currency and multi-language invoices',
    ],
  },
  {
    icon: TrendingUp,
    title: 'For Financial Controllers & CFOs',
    features: [
      'Gain real-time visibility into AP pipeline and cash flow',
      'Standardize extraction rules across the entire organization',
      'Audit-ready outputs with source file traceability',
    ],
  },
  {
    icon: User,
    title: 'For Business Owners & Operators',
    features: [
      'No training needed — just describe what you want extracted',
      'Unlimited pages free every month, no credit card required',
      'Export to Excel, CSV, or JSON for any downstream workflow',
    ],
  },
]

export function FinanceRoles() {
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
            For Every{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              Finance Role
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you&apos;re processing invoices, closing the books, or overseeing 
            the entire financial operation — we&apos;ve got you covered.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <role.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">{role.title}</h3>
                  <ul className="space-y-2">
                    {role.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
