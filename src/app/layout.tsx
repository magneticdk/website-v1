import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Magnetic Fundraising Toolkit',
  description: 'AI-powered fundraising toolkit for Danish charities',
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
