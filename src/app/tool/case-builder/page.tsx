'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'
import OutputViewer from '@/components/tools/OutputViewer'
import OutputActions from '@/components/tools/OutputActions'
import { useOutputs } from '@/hooks/useOutputs'
import { useProfile } from '@/hooks/useProfile'

interface CaseFormData {
  // Step 1
  problem: string
  affected: string
  problem_scale: string
  geographic_scope: string
  // Step 2
  solution: string
  core_programs: string
  unique_value: string
  impact_evidence: string
  // Step 3
  funding_need: string
  funding_covers: string
  timeframe: string
  expected_results: string
  // Step 4
  track_record: string
  partnerships: string
  testimonials: string
  certifications: string
}

export default function CaseBuilderPage() {
  const { profile } = useProfile()
  const { saveOutput } = useOutputs()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CaseFormData>({
    problem: '',
    affected: '',
    problem_scale: '',
    geographic_scope: '',
    solution: '',
    core_programs: '',
    unique_value: '',
    impact_evidence: '',
    funding_need: '',
    funding_covers: '',
    timeframe: '',
    expected_results: '',
    track_record: '',
    partnerships: '',
    testimonials: '',
    certifications: '',
  })
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const updateFormData = (field: keyof CaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    setError('')

    switch (step) {
      case 1:
        if (!formData.problem || !formData.affected) {
          setError('Udfyld venligst alle påkrævede felter')
          return false
        }
        break
      case 2:
        if (!formData.solution || !formData.core_programs) {
          setError('Udfyld venligst alle påkrævede felter')
          return false
        }
        break
      case 3:
        if (!formData.funding_need || !formData.funding_covers) {
          setError('Udfyld venligst alle påkrævede felter')
          return false
        }
        break
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setError('')
    setCurrentStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGenerate = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    setError('')

    try {
      const userMessage = `Generér et Case for Support-dokument.

PROBLEMET:
- Hvad er problemet: ${formData.problem}
- Hvem er påvirket: ${formData.affected}
- Problemets størrelse: ${formData.problem_scale || 'Ikke specificeret'}
- Geografisk omfang: ${formData.geographic_scope || 'Ikke specificeret'}

JERES LØSNING:
- Hvad gør organisationen: ${formData.solution}
- Kerneprogrammer: ${formData.core_programs}
- Unikke styrker: ${formData.unique_value || 'Ikke specificeret'}
- Evidens for impact: ${formData.impact_evidence || 'Ikke specificeret'}

BEHOVET:
- Finansieringsbehov: ${formData.funding_need}
- Hvad dækker finansieringen: ${formData.funding_covers}
- Tidshorisont: ${formData.timeframe || 'Ikke specificeret'}
- Forventede resultater: ${formData.expected_results || 'Ikke specificeret'}

TROVÆRDIGHED:
- Hidtidige resultater: ${formData.track_record || 'Ikke specificeret'}
- Partnerskaber: ${formData.partnerships || 'Ikke specificeret'}
- Testimonials: ${formData.testimonials || 'Ikke specificeret'}
- Godkendelser: ${formData.certifications || 'Ikke specificeret'}

Organisationsnavn: ${profile?.name || 'Organisationen'}`

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: 'case-builder',
          user_message: userMessage,
          input_data: formData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Der opstod en fejl')
      }

      const data = await response.json()
      setOutput(data.output)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (output) {
      await saveOutput(
        'case-builder',
        output,
        `Case for Support - ${profile?.name || 'Din organisation'}`,
        formData
      )
    }
  }

  return (
    <ToolLayout
      toolName="Søg fonde eller partnerskabe"
      toolDescription="Skab en overbevisende sag for støtte"
      output={
        output ? (
          <>
            <OutputViewer content={output} />
            <OutputActions
              output={output}
              toolSlug="case-builder"
              inputData={formData}
              onRegenerate={handleGenerate}
              onSave={handleSave}
            />
          </>
        ) : null
      }
    >
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#333333]">
              Trin {currentStep} af 4
            </span>
            <span className="text-sm text-[#718096]">
              {currentStep === 1 && 'Problemet'}
              {currentStep === 2 && 'Jeres løsning'}
              {currentStep === 3 && 'Behovet'}
              {currentStep === 4 && 'Troværdighed'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1B4F72] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-[#E74C3C]">{error}</p>
          </div>
        )}

        {/* Step 1: Problemet */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#333333]">
              Trin 1: Problemet
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hvad er problemet I adresserer? <span className="text-[#E74C3C]">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.problem}
                onChange={(e) => updateFormData('problem', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Beskriv det centrale problem eller behov..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hvem er påvirket? <span className="text-[#E74C3C]">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.affected}
                onChange={(e) => updateFormData('affected', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Hvem lider under dette problem?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hvor stort er problemet?
              </label>
              <textarea
                rows={2}
                value={formData.problem_scale}
                onChange={(e) => updateFormData('problem_scale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Inkluder tal og statistik"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Geografisk omfang
              </label>
              <select
                value={formData.geographic_scope}
                onChange={(e) => updateFormData('geographic_scope', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
              >
                <option value="">Vælg geografisk omfang</option>
                <option value="Lokalt">Lokalt</option>
                <option value="Regionalt">Regionalt</option>
                <option value="Nationalt">Nationalt</option>
                <option value="Internationalt">Internationalt</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
              >
                Næste
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Jeres løsning */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#333333]">
              Trin 2: Jeres løsning
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hvad gør jeres organisation? <span className="text-[#E74C3C]">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.solution}
                onChange={(e) => updateFormData('solution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Beskriv jeres tilgang til at løse problemet..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Kerneprogrammer <span className="text-[#E74C3C]">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.core_programs}
                onChange={(e) => updateFormData('core_programs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Jeres primære programmer og aktiviteter..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hvad gør jer unikke?
              </label>
              <textarea
                rows={2}
                value={formData.unique_value}
                onChange={(e) => updateFormData('unique_value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Jeres differentieringspunkter..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Evidens for impact
              </label>
              <textarea
                rows={3}
                value={formData.impact_evidence}
                onChange={(e) => updateFormData('impact_evidence', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Resultater, statistik, historier..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Tilbage
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
              >
                Næste
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Behovet */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#333333]">
              Trin 3: Behovet
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Finansieringsbehov <span className="text-[#E74C3C]">*</span>
              </label>
              <input
                type="text"
                value={formData.funding_need}
                onChange={(e) => updateFormData('funding_need', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="F.eks. 500.000 kr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hvad dækker finansieringen? <span className="text-[#E74C3C]">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.funding_covers}
                onChange={(e) => updateFormData('funding_covers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Specificer anvendelse af midler..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Tidshorisont
              </label>
              <select
                value={formData.timeframe}
                onChange={(e) => updateFormData('timeframe', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
              >
                <option value="">Vælg tidshorisont</option>
                <option value="6 måneder">6 måneder</option>
                <option value="1 år">1 år</option>
                <option value="2 år">2 år</option>
                <option value="3 år">3 år</option>
                <option value="5 år">5 år</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Forventede resultater
              </label>
              <textarea
                rows={3}
                value={formData.expected_results}
                onChange={(e) => updateFormData('expected_results', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Konkrete, målbare outcomes..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Tilbage
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors"
              >
                Næste
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Troværdighed */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#333333]">
              Trin 4: Troværdighed
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Hidtidige resultater
              </label>
              <textarea
                rows={3}
                value={formData.track_record}
                onChange={(e) => updateFormData('track_record', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Jeres track record og erfaringer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Partnerskaber
              </label>
              <textarea
                rows={2}
                value={formData.partnerships}
                onChange={(e) => updateFormData('partnerships', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Samarbejdspartnere og netværk..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Testimonials eller citater
              </label>
              <textarea
                rows={2}
                value={formData.testimonials}
                onChange={(e) => updateFormData('testimonials', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Citater fra beneficiaries, partnere eller eksperter..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Godkendelser / certificeringer
              </label>
              <textarea
                rows={2}
                value={formData.certifications}
                onChange={(e) => updateFormData('certifications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Certificeringer, akkrediteringer, medlemskaber..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Tilbage
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#27AE60] text-white rounded-md hover:bg-[#229954] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Genererer...' : 'Generér Case for Support'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
