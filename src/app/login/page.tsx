'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createBrowserClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      if (err instanceof Error) {
        // Translate common Supabase errors to Danish
        if (err.message.includes('Invalid login credentials')) {
          setError('Ugyldig e-mail eller adgangskode')
        } else if (err.message.includes('Email not confirmed')) {
          setError('E-mail er ikke bekræftet. Tjek din indbakke.')
        } else {
          setError('Der opstod en fejl. Prøv venligst igen.')
        }
      } else {
        setError('Der opstod en uventet fejl')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1B4F72] mb-2">Magnetic</h1>
          <p className="text-[#718096]">Fundraising Toolkit</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-[#333333] mb-6">
            Log ind
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-[#E74C3C]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#333333] mb-1"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent"
                placeholder="din@email.dk"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#333333] mb-1"
              >
                Adgangskode
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent"
                placeholder="Din adgangskode"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#1B4F72] hover:underline"
              >
                Glemt adgangskode?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4F72] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#15395a] focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logger ind...' : 'Log ind'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-[#718096]">
            Har du ikke en konto?{' '}
            <Link
              href="/signup"
              className="text-[#27AE60] font-medium hover:underline"
            >
              Opret konto
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
