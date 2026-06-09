'use client'

import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { ExtractionTool } from '@/components/extraction-tool'
import { SampleOutput } from '@/components/sample-output'
import { DocumentTypes } from '@/components/document-types'
import { HowItWorks } from '@/components/how-it-works'
import { FeaturesSection } from '@/components/features-section'
import { FinanceRoles } from '@/components/finance-roles'
import { ApiSection } from '@/components/api-section'
import { SecuritySection } from '@/components/security-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero + Extraction Tool - integrated */}
        <section className="relative overflow-hidden pb-8">
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent" />
            <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/5" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
            {/* Hero heading */}
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Extract invoice data to{' '}
                <span className="text-emerald-600 dark:text-emerald-400">Excel</span>{' '}
                with AI
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Describe what you need. Any document, any layout, any language. Built
                for repeatable spreadsheet output across hundreds or thousands of pages.
              </p>
            </div>

            {/* Extraction Tool - right in the hero */}
            <div className="mt-10">
              <ExtractionTool />
            </div>

            {/* Stats */}
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 pb-8">
              {[
                { value: '2M+', label: 'invoices processed' },
                { value: '5,000', label: 'pages per single PDF' },
                { value: '6,000', label: 'files per batch' },
                { value: '1-8s', label: 'per page' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Output */}
        <SampleOutput />

        {/* Document Types */}
        <DocumentTypes />

        {/* How It Works */}
        <HowItWorks />

        {/* Features */}
        <FeaturesSection />

        {/* Finance Roles */}
        <FinanceRoles />

        {/* API */}
        <ApiSection />

        {/* Security */}
        <SecuritySection />
      </main>

      <Footer />
    </div>
  )
}
