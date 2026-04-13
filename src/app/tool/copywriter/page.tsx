'use client'

import { useState, FormEvent } from 'react'
import ToolLayout from '@/components/tools/ToolLayout'
import OutputViewer from '@/components/tools/OutputViewer'
import OutputActions from '@/components/tools/OutputActions'
import { useOutputs } from '@/hooks/useOutputs'

interface FormData extends Record<string, unknown> {
  content_type: string
  audience: string
  campaign_name: string
  fundraising_goal: string
  project_description: string
  cta: string
  suggested_amounts: string
  emotional_tones: string[] // Changed to array for multiple selections
  length: string
  persona_targeting: string
}

export default function CopywriterPage() {
  const { saveOutput } = useOutputs()
  const [formData, setFormData] = useState<FormData>({
    content_type: '',
    audience: '',
    campaign_name: '',
    fundraising_goal: '',
    project_description: '',
    cta: '',
    suggested_amounts: '',
    emotional_tones: [],
    length: '',
    persona_targeting: '',
  })
  const [outputs, setOutputs] = useState<Array<{ tone: string; text: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setError('')

    // Validation
    if (!formData.content_type || !formData.audience || !formData.campaign_name || 
        !formData.fundraising_goal || !formData.project_description || 
        !formData.cta || !formData.suggested_amounts || !formData.length) {
      setError('Udfyld venligst alle påkrævede felter')
      return
    }

    if (formData.emotional_tones.length === 0) {
      setError('Vælg mindst én emotionel tone')
      return
    }

    if (formData.emotional_tones.length > 2) {
      setError('Vælg maksimalt to emotionelle toner for A/B-test')
      return
    }

    setIsLoading(true)
    setOutputs([])

    try {
      const generatedOutputs: Array<{ tone: string; text: string }> = []

      // Generate output for each selected tone
      for (const tone of formData.emotional_tones) {
        const userMessage = `Generer en ${formData.content_type.toLowerCase()} til ${formData.audience.toLowerCase()}.

Kampagne: ${formData.campaign_name}
Fundraising-mål: ${formData.fundraising_goal}
Projekt: ${formData.project_description}
CTA: ${formData.cta}
Foreslåede gavebeløb: ${formData.suggested_amounts}
Emotionel tone: ${tone}
Længde: ${formData.length}
${formData.persona_targeting ? `Persona: ${formData.persona_targeting}` : ''}`

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool_slug: 'copywriter',
            user_message: userMessage,
            input_data: { ...formData, emotional_tone: tone },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Der opstod en fejl')
        }

        const data = await response.json()
        generatedOutputs.push({ tone, text: data.output })
      }

      setOutputs(generatedOutputs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (outputText: string, tone: string) => {
    if (outputText) {
      await saveOutput(
        'copywriter',
        outputText,
        `${formData.campaign_name || 'Fundraising tekst'} - ${tone}`,
        formData
      )
    }
  }

  const toggleTone = (tone: string) => {
    const currentTones = formData.emotional_tones
    if (currentTones.includes(tone)) {
      // Remove tone
      setFormData({ ...formData, emotional_tones: currentTones.filter(t => t !== tone) })
    } else {
      // Add tone (max 2)
      if (currentTones.length < 2) {
        setFormData({ ...formData, emotional_tones: [...currentTones, tone] })
      }
    }
  }

  return (
    <ToolLayout
      toolName="Fundraising Tekstforfatter"
      toolDescription="Skriv appeller, e-mails og breve der virker"
      isLoading={isLoading}
      onGenerate={handleGenerate}
      output={
        outputs.length > 0 ? (
          <div className="space-y-8">
            {outputs.map((output, index) => (
              <div key={index} className="relative">
                {outputs.length > 1 && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#1B4F72] text-white text-sm font-medium rounded-full">
                      Variant {String.fromCharCode(65 + index)} - {output.tone}
                    </span>
                  </div>
                )}
                <OutputViewer content={output.text} />
                <OutputActions
                  output={output.text}
                  toolSlug="copywriter"
                  inputData={formData}
                  onRegenerate={handleGenerate}
                  onSave={() => handleSave(output.text, output.tone)}
                />
              </div>
            ))}
          </div>
        ) : null
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-[#E74C3C]">{error}</p>
        </div>
      )}

      <form className="space-y-6">
        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Indholdstype <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.content_type}
            onChange={(e) => updateFormData('content_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg indholdstype</option>
            <option value="E-mail-appel">E-mail-appel</option>
            <option value="Appelbrev">Appelbrev</option>
            <option value="Landingsside-tekst">Landingsside-tekst</option>
            <option value="Nyhedsbrev">Nyhedsbrev</option>
            <option value="Social medie-opslag">Social medie-opslag</option>
            <option value="SMS">SMS</option>
            <option value="Takkebrev">Takkebrev</option>
            <option value="Event-invitation">Event-invitation</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Målgruppe <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.audience}
            onChange={(e) => updateFormData('audience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg målgruppe</option>
            <option value="Nye donorer">Nye donorer</option>
            <option value="Eksisterende donorer">Eksisterende donorer</option>
            <option value="Frafaldne donorer">Frafaldne donorer</option>
            <option value="Stordonorer">Stordonorer</option>
            <option value="Virksomhedspartnere">Virksomhedspartnere</option>
            <option value="Offentligheden">Offentligheden</option>
          </select>
        </div>

        {/* Campaign Name */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Kampagnenavn <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            value={formData.campaign_name}
            onChange={(e) => updateFormData('campaign_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="F.eks. Juleindsamling 2026"
            required
          />
        </div>

        {/* Fundraising Goal */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Fundraising-mål <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            value={formData.fundraising_goal}
            onChange={(e) => updateFormData('fundraising_goal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="F.eks. Indsamle 200.000 kr til vinterpakker"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Projektbeskrivelse <span className="text-[#E74C3C]">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.project_description}
            onChange={(e) => updateFormData('project_description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="Beskriv det projekt eller den sag pengene går til..."
            required
          />
        </div>

        {/* CTA */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Handlingsopfordring (CTA) <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            value={formData.cta}
            onChange={(e) => updateFormData('cta', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="F.eks. Giv en gave i dag"
            required
          />
        </div>

        {/* Suggested Amounts */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Foreslåede gavebeløb <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            value={formData.suggested_amounts}
            onChange={(e) => updateFormData('suggested_amounts', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="F.eks. 100 kr, 250 kr, 500 kr"
            required
          />
        </div>

        {/* Emotional Tone - Multi-select with checkboxes */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Emotionel tone <span className="text-[#E74C3C]">*</span>
          </label>
          <p className="text-xs text-[#718096] mb-3">
            Vælg op til 2 toner for A/B-test
          </p>
          <div className="space-y-2">
            {['Håbefuld', 'Akut', 'Taknemlig', 'Inspirerende', 'Medfølende', 'Formel'].map((tone) => (
              <label
                key={tone}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.emotional_tones.includes(tone)}
                  onChange={() => toggleTone(tone)}
                  disabled={!formData.emotional_tones.includes(tone) && formData.emotional_tones.length >= 2}
                  className="h-4 w-4 text-[#1B4F72] focus:ring-[#1B4F72] border-gray-300 rounded"
                />
                <span className="text-sm text-[#333333]">{tone}</span>
              </label>
            ))}
          </div>
          {formData.emotional_tones.length > 0 && (
            <p className="text-xs text-[#1B4F72] mt-2">
              Valgt: {formData.emotional_tones.join(', ')}
            </p>
          )}
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Længde <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.length}
            onChange={(e) => updateFormData('length', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg længde</option>
            <option value="Kort (under 200 ord)">Kort (under 200 ord)</option>
            <option value="Medium (200–500 ord)">Medium (200–500 ord)</option>
            <option value="Lang (500+ ord)">Lang (500+ ord)</option>
          </select>
        </div>

        {/* Persona Targeting (Optional) */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Personlighedsmålretning
          </label>
          <textarea
            rows={2}
            value={formData.persona_targeting}
            onChange={(e) => updateFormData('persona_targeting', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="Valgfrit: Beskriv en specifik donor-persona..."
          />
        </div>
      </form>
    </ToolLayout>
  )
}
