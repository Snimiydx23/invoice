'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Code2, Globe } from 'lucide-react'

const apiFeatures = [
  {
    icon: BookOpen,
    title: 'LLM-Ready Documentation',
    description:
      'Comprehensive API docs designed for AI-assisted development. Copy-paste code snippets and integrate in minutes.',
    detail: 'OpenAPI spec · Code examples · Quickstart guide',
  },
  {
    icon: Code2,
    title: 'Python & Node.js SDKs',
    description:
      'Official SDKs for Python and Node.js with full type support. Install, configure, and start extracting in under 5 minutes.',
    detail: 'pip install · npm install · Full TypeScript types',
  },
  {
    icon: Globe,
    title: 'Any Language via REST API',
    description:
      'Simple REST endpoints that work with any programming language. Send files, receive structured JSON — it just works.',
    detail: 'POST /extract · GET /download · JSON responses',
  },
]

export function ApiSection() {
  return (
    <section id="api" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Automate with the{' '}
            <span className="text-emerald-600 dark:text-emerald-400">API</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Integrate invoice extraction directly into your workflows, ERP systems, 
            and custom applications.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {apiFeatures.map((feat, i) => (
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
                  <h3 className="mb-2 font-semibold">{feat.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {feat.description}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground/70">
                    {feat.detail}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Code snippet preview */}
        <motion.div
          className="mt-12 mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">extract.py</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
              <code>
                <span className="text-emerald-600 dark:text-emerald-400">import</span>{' '}
                <span className="text-foreground">invoice_extraction</span>
                {'\n\n'}
                <span className="text-foreground">client = invoice_extraction.Client(</span>
                <span className="text-yellow-600 dark:text-yellow-400">api_key</span>
                <span className="text-foreground">=</span>
                <span className="text-emerald-600 dark:text-emerald-400">&quot;your-key&quot;</span>
                <span className="text-foreground">)</span>
                {'\n\n'}
                <span className="text-foreground">result = client.extract(</span>
                {'\n'}
                <span className="text-foreground">    </span>
                <span className="text-yellow-600 dark:text-yellow-400">prompt</span>
                <span className="text-foreground">=</span>
                <span className="text-emerald-600 dark:text-emerald-400">&quot;Extract invoice #, date, vendor, total&quot;</span>
                <span className="text-foreground">,</span>
                {'\n'}
                <span className="text-foreground">    </span>
                <span className="text-yellow-600 dark:text-yellow-400">files</span>
                <span className="text-foreground">=[</span>
                <span className="text-emerald-600 dark:text-emerald-400">&quot;invoices/*.pdf&quot;</span>
                <span className="text-foreground">]</span>
                {'\n'}
                <span className="text-foreground">)</span>
                {'\n\n'}
                <span className="text-foreground">result.to_excel(</span>
                <span className="text-emerald-600 dark:text-emerald-400">&quot;output.xlsx&quot;</span>
                <span className="text-foreground">)</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
