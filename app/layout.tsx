import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { CategoryProvider } from "@/services/useCategories"

const inter = Inter({ subsets: ["latin"] })
const iranYekan = localFont({
  src: [
    { path: "../fonts/IRANYekanXVFaNumVF.woff2", weight: "100 900", style: "normal" },
  ],
  display: "swap",
})

export const metadata: Metadata = {
  title: "سیستم مدیریت خدمات IT",
  description: "سیستم مدیریت درخواست‌های فنی و پشتیبانی",
    generator: 'Ali_Razi'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} ${iranYekan.className} font-iran`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CategoryProvider>{children}</CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
