'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    email: '',
    password: '',
    isCharity: false,
    acceptTerms: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.isCharity) {
      setError('Din organisation skal være en dansk velgørende forening')
      return
    }

    if (!formData.acceptTerms) {
      setError('Du skal acceptere vilkår og betingelser')
      return
    }

    if (formData.password.length < 8) {
      setError('Adgangskode skal være mindst 8 tegn')
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            organisation: formData.organisation,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user) {
        router.push('/onboarding')
      }
    } catch (err) {
      if (err instanceof Error) {
        // Translate common Supabase errors to Danish
        if (err.message.includes('already registered')) {
          setError('Denne e-mail er allerede registreret')
        } else if (err.message.includes('invalid email')) {
          setError('Ugyldig e-mailadresse')
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
            Opret din konto
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-[#E74C3C]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#333333] mb-1"
              >
                Fulde navn
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent"
                placeholder="Dit fulde navn"
              />
            </div>

            {/* Organisation */}
            <div>
              <label
                htmlFor="organisation"
                className="block text-sm font-medium text-[#333333] mb-1"
              >
                Organisation
              </label>
              <input
                type="text"
                id="organisation"
                required
                value={formData.organisation}
                onChange={(e) =>
                  setFormData({ ...formData, organisation: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent"
                placeholder="Organisationens navn"
              />
            </div>

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
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent"
                placeholder="Minimum 8 tegn"
              />
            </div>

            {/* Charity Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="isCharity"
                checked={formData.isCharity}
                onChange={(e) =>
                  setFormData({ ...formData, isCharity: e.target.checked })
                }
                className="mt-1 h-4 w-4 text-[#1B4F72] focus:ring-[#1B4F72] border-gray-300 rounded"
              />
              <label
                htmlFor="isCharity"
                className="ml-2 text-sm text-[#333333]"
              >
                Min organisation er en dansk velgørende forening
              </label>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  setFormData({ ...formData, acceptTerms: e.target.checked })
                }
                className="mt-1 h-4 w-4 text-[#1B4F72] focus:ring-[#1B4F72] border-gray-300 rounded"
              />
              <label
                htmlFor="acceptTerms"
                className="ml-2 text-sm text-[#333333]"
              >
                Jeg accepterer vilkår og betingelser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#27AE60] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#229954] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Opretter konto...' : 'Opret konto'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#718096]">
            Har du allerede en konto?{' '}
            <Link
              href="/login"
              className="text-[#1B4F72] font-medium hover:underline"
            >
              Log ind
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
