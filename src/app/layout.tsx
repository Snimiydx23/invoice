import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice Data Extraction AI — Extract Invoice Data to Excel with AI",
  description:
    "Extract invoice data to Excel with AI. Describe what you need. Any document, any layout, any language. Built for repeatable spreadsheet output across hundreds or thousands of pages.",
  keywords: [
    "invoice extraction",
    "AI",
    "Excel",
    "data extraction",
    "PDF",
    "spreadsheet",
    "automation",
  ],
  authors: [{ name: "Invoice Data Extraction" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Invoice Data Extraction AI",
    description:
      "Extract invoice data to Excel with AI. Any document, any layout, any language.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
