import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Magnetic Fundraising Toolkit — AI for danske fundraisere',
  description: 'AI-drevet værktøjskasse til danske fundraisere. Skriv bedre appeller, byg stærkere strategier og forstå dine støtter med AI der kender din organisation.',
  keywords: 'fundraising, AI, dansk, velgørende, donation, strategi, appeller, nonprofit',
  authors: [{ name: 'Magnetic Consulting' }],
  openGraph: {
    title: 'Magnetic Fundraising Toolkit — AI for danske fundraisere',
    description: 'AI-drevet værktøjskasse til danske fundraisere. Skriv bedre appeller, byg stærkere strategier og forstå dine støtter.',
    type: 'website',
    locale: 'da_DK',
    siteName: 'Magnetic Fundraising Toolkit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magnetic Fundraising Toolkit — AI for danske fundraisere',
    description: 'AI-drevet værktøjskasse til danske fundraisere.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-[#F5F7FA]`}>
        {children}
      </body>
    </html>
  )
}
