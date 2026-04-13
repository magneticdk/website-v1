import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-[#1B4F72]" />
        </div>
        <h1 className="text-6xl font-bold text-[#1B4F72] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#333333] mb-4">
          Siden blev ikke fundet
        </h2>
        <p className="text-[#718096] mb-8">
          Den side du leder efter eksisterer ikke, eller er blevet flyttet.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
        >
          Tilbage til dashboard
        </Link>
      </div>
    </div>
  )
}
