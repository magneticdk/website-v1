'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Globe, Upload, CheckCircle2, ArrowLeft } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useProfile } from '@/hooks/useProfile'
import { createBrowserClient } from '@/lib/supabase/client'

interface FormData {
  name: string
  cvr_number: string
  website_url: string
  mission: string
  programs: string
  target_audience: string
  geographic_focus: string
  key_messages: string
  brand_voice: string
  annual_income: string
  logo_url: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { profile, loading: profileLoading, refetch } = useProfile()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cvr_number: '',
    website_url: '',
    mission: '',
    programs: '',
    target_audience: '',
    geographic_focus: '',
    key_messages: '',
    brand_voice: '',
    annual_income: '',
    logo_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [scanningWebsite, setScanningWebsite] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        cvr_number: profile.cvr_number || '',
        website_url: profile.website_url || '',
        mission: profile.mission || '',
        programs: profile.programs || '',
        target_audience: profile.target_audience || '',
        geographic_focus: profile.geographic_focus || '',
        key_messages: profile.key_messages || '',
        brand_voice: profile.brand_voice || '',
        annual_income: profile.annual_income || '',
        logo_url: profile.logo_url || '',
      })
    }
  }, [profile])

  const calculateProfileCompletion = (): number => {
    const fields = Object.values(formData)
    const filledFields = fields.filter((field) => field && field.trim()).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleScanWebsite = async () => {
    if (!formData.website_url) {
      setError('Indtast venligst en hjemmeside-URL først')
      return
    }

    setScanningWebsite(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: 'website-scanner',
          user_message: `Analysér denne hjemmeside: ${formData.website_url}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Kunne ikke scanne hjemmesiden')
      }

      const data = await response.json()

      // Try to parse structured data from AI response
      // For now, just show in mission field - you can enhance parsing
      if (data.output) {
        updateFormData('mission', data.output)
      }
    } catch (err) {
      setError('Der opstod en fejl under scanning af hjemmesiden')
    } finally {
      setScanningWebsite(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Ikke logget ind')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-logo.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('organisation-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('organisation-assets').getPublicUrl(filePath)

      updateFormData('logo_url', publicUrl)
    } catch (err) {
      setError('Kunne ikke uploade logo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Organisationsnavn er påkrævet')
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Ikke logget ind')

      const { error: updateError } = await supabase
        .from('organisation_profiles')
        .update({
          name: formData.name,
          cvr_number: formData.cvr_number || null,
          website_url: formData.website_url || null,
          mission: formData.mission || null,
          programs: formData.programs || null,
          target_audience: formData.target_audience || null,
          geographic_focus: formData.geographic_focus || null,
          key_messages: formData.key_messages || null,
          brand_voice: formData.brand_voice || null,
          annual_income: formData.annual_income || null,
          logo_url: formData.logo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (updateError) throw updateError

      setShowSuccess(true)
      await refetch()

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl')
    } finally {
      setLoading(false)
    }
  }

  const profileCompletion = calculateProfileCompletion()

  if (profileLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#1B4F72] mx-auto mb-4" />
            <p className="text-[#718096]">Indlæser profil...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Din organisationsprofil" />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[#1B4F72] hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbage til dashboard
            </Link>

            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[#333333]">Profil fuldstændighed</h3>
                <span className="text-lg font-bold text-[#1B4F72]">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#27AE60] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-sm text-[#718096] mt-2">
                Jo mere komplet din profil er, jo bedre bliver AI-resultaterne
              </p>
            </div>

            {/* Success Toast */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                <p className="text-sm text-[#27AE60] font-medium">Profil opdateret</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-[#E74C3C]">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grundlæggende info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#333333] mb-4">
                  Grundlæggende info
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Organisationsnavn <span className="text-[#E74C3C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="Dansk Røde Kors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      CVR-nummer
                    </label>
                    <input
                      type="text"
                      value={formData.cvr_number}
                      onChange={(e) => updateFormData('cvr_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Hjemmeside-URL
                    </label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => updateFormData('website_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="https://dinorganisation.dk"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-[#718096] mb-3">
                      Genvej: Lad AI scanne din hjemmeside for at opdatere profilen
                    </p>
                    <button
                      type="button"
                      onClick={handleScanWebsite}
                      disabled={scanningWebsite || !formData.website_url}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2E75B6] text-white rounded-md hover:bg-[#1B4F72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {scanningWebsite ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Scanner hjemmeside...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Scan hjemmeside med AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Om organisationen */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#333333] mb-4">
                  Om organisationen
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Mission
                    </label>
                    <textarea
                      rows={4}
                      value={formData.mission}
                      onChange={(e) => updateFormData('mission', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="Beskriv jeres mission og formål..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Kerneaktiviteter og programmer
                    </label>
                    <textarea
                      rows={4}
                      value={formData.programs}
                      onChange={(e) => updateFormData('programs', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="Beskriv jeres programmer og aktiviteter..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Målgruppe — hvem hjælper I
                    </label>
                    <textarea
                      rows={3}
                      value={formData.target_audience}
                      onChange={(e) => updateFormData('target_audience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="Beskriv jeres målgruppe..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Geografisk fokus
                    </label>
                    <select
                      value={formData.geographic_focus}
                      onChange={(e) => updateFormData('geographic_focus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    >
                      <option value="">Vælg geografisk fokus</option>
                      <option value="Lokalt">Lokalt</option>
                      <option value="Regionalt">Regionalt</option>
                      <option value="Nationalt">Nationalt</option>
                      <option value="Internationalt">Internationalt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Nøglebudskaber
                    </label>
                    <textarea
                      rows={3}
                      value={formData.key_messages}
                      onChange={(e) => updateFormData('key_messages', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="Jeres primære budskaber til støtter..."
                    />
                  </div>
                </div>
              </div>

              {/* Kommunikationsstil */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#333333] mb-4">
                  Kommunikationsstil
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Brandets stemme
                    </label>
                    <select
                      value={formData.brand_voice}
                      onChange={(e) => updateFormData('brand_voice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    >
                      <option value="">Vælg brandets stemme</option>
                      <option value="Varm & Personlig">Varm & Personlig</option>
                      <option value="Professionel & Autoritativ">Professionel & Autoritativ</option>
                      <option value="Passioneret & Akut">Passioneret & Akut</option>
                      <option value="Venlig & Uformel">Venlig & Uformel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Årlig indtægt
                    </label>
                    <select
                      value={formData.annual_income}
                      onChange={(e) => updateFormData('annual_income', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    >
                      <option value="">Vælg årlig indtægt</option>
                      <option value="Under 500.000 kr">Under 500.000 kr</option>
                      <option value="500.000–2 mio kr">500.000–2 mio kr</option>
                      <option value="2–10 mio kr">2–10 mio kr</option>
                      <option value="Over 10 mio kr">Over 10 mio kr</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Logo upload
                    </label>
                    <div className="mt-2">
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#1B4F72] transition-colors">
                        <Upload className="w-5 h-5 text-[#718096]" />
                        <span className="text-sm text-[#718096]">
                          {formData.logo_url ? 'Logo uploadet ✓' : 'Vælg logo (PNG, JPG, SVG)'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#27AE60] text-white font-medium rounded-md hover:bg-[#229954] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Gemmer...' : 'Gem ændringer'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
