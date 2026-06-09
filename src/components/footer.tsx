import Link from 'next/link'
import { FileSpreadsheet } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Start Extraction', href: '#extraction' },
    { label: 'API', href: '#api' },
    { label: 'Documentation', href: '#' },
  ],
  Resources: [
    { label: 'Extraction Guide', href: '#how-it-works' },
    { label: 'Supported Formats', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  'Trust & Security': [
    { label: 'Security', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'GDPR', href: '#' },
    { label: 'SOC 2', href: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'DPA', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold tracking-tight">
                INVOICE DATA
                <br />
                EXTRACTION
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Extract invoice data to Excel with AI. Any document, any layout,
              any language.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Invoice Data Extraction. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
