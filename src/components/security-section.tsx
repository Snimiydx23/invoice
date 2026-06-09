'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Clock, Lock, Eye } from 'lucide-react'

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: 'No AI Training',
    description:
      'Your documents are never used to train AI models. Your data stays your data — period.',
  },
  {
    icon: Clock,
    title: 'Short Retention Windows',
    description:
      'Documents are automatically deleted after processing. No long-term storage of your sensitive financial data.',
  },
  {
    icon: Lock,
    title: 'Secure by Design',
    description:
      'End-to-end encryption in transit and at rest. SOC 2 compliant infrastructure with regular security audits.',
  },
  {
    icon: Eye,
    title: 'No Ads. No Resale.',
    description:
      'We will never show ads, sell your data, or share it with third parties. Your privacy is not a product.',
  },
]

export function SecuritySection() {
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
            Enterprise-Grade{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              Security & Compliance
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Your financial documents contain sensitive data. We treat them with 
            the security and respect they deserve.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <feat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
