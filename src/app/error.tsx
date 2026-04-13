'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-[#E74C3C]" />
        </div>
        <h1 className="text-2xl font-bold text-[#333333] mb-4">
          Noget gik galt
        </h1>
        <p className="text-[#718096] mb-8">
          Der opstod en uventet fejl. Prøv venligst igen, eller kontakt support hvis problemet fortsætter.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
          >
            Prøv igen
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
          >
            Tilbage til dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
