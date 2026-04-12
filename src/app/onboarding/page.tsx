'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Globe } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

type FormData = {
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

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [scanningWebsite, setScanningWebsite] = useState(false)
  const [error, setError] = useState('')

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
          tool: 'website-scanner',
          websiteUrl: formData.website_url,
        }),
      })

      if (!response.ok) {
        throw new Error('Kunne ikke scanne hjemmesiden')
      }

      const data = await response.json()

      // Auto-fill Step 2 fields
      if (data.mission) updateFormData('mission', data.mission)
      if (data.programs) updateFormData('programs', data.programs)
      if (data.target_audience) updateFormData('target_audience', data.target_audience)
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

  const handleNext = () => {
    setError('')

    // Validation for Step 1
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Organisationsnavn er påkrævet')
        return
      }
    }

    // Validation for Step 2
    if (currentStep === 2) {
      if (!formData.mission.trim()) {
        setError('Mission er påkrævet')
        return
      }
      if (!formData.programs.trim()) {
        setError('Kerneaktiviteter og programmer er påkrævet')
        return
      }
      if (!formData.target_audience.trim()) {
        setError('Målgruppe er påkrævet')
        return
      }
    }

    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setError('')
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Ikke logget ind')

      const { error: insertError } = await supabase
        .from('organisation_profiles')
        .insert({
          user_id: user.id,
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
        })

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1B4F72] mb-2">
            Velkommen til Magnetic
          </h1>
          <p className="text-[#718096]">
            Lad os komme i gang med at opsætte din profil
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#333333]">
              Trin {currentStep} af 3
            </span>
            <span className="text-sm text-[#718096]">
              {currentStep === 1 && 'Grundlæggende info'}
              {currentStep === 2 && 'Om jeres organisation'}
              {currentStep === 3 && 'Kommunikationsstil'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1B4F72] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-[#E74C3C]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Grundlæggende info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#333333] mb-4">
                  Grundlæggende info
                </h2>

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
                    Genvej: Lad AI scanne din hjemmeside for automatisk at udfylde profilen
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

                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
                  >
                    Næste
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Om jeres organisation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#333333] mb-4">
                  Om jeres organisation
                </h2>

                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1">
                    Mission <span className="text-[#E74C3C]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.mission}
                    onChange={(e) => updateFormData('mission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    placeholder="Beskriv jeres mission og formål..."
                  />
                  <p className="text-xs text-[#718096] mt-1">Maks. 300 ord</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1">
                    Kerneaktiviteter og programmer <span className="text-[#E74C3C]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.programs}
                    onChange={(e) => updateFormData('programs', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    placeholder="Beskriv jeres programmer og aktiviteter..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1">
                    Målgruppe — hvem hjælper I <span className="text-[#E74C3C]">*</span>
                  </label>
                  <textarea
                    required
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

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2.5 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Tilbage
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
                  >
                    Næste
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Kommunikationsstil */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#333333] mb-4">
                  Kommunikationsstil
                </h2>

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

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2.5 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Tilbage
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#27AE60] text-white rounded-md hover:bg-[#229954] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Gemmer profil...' : 'Gem profil'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
