'use client'

import { useState, FormEvent } from 'react'
import ToolLayout from '@/components/tools/ToolLayout'
import OutputViewer from '@/components/tools/OutputViewer'
import OutputActions from '@/components/tools/OutputActions'
import { useOutputs } from '@/hooks/useOutputs'

interface FormData extends Record<string, unknown> {
  donor_type: string
  time_period: string
  channels: string[]
  primary_goal: string
  budget_level: string
  special_considerations: string
}

export default function StewardshipPage() {
  const { saveOutput } = useOutputs()
  const [formData, setFormData] = useState<FormData>({
    donor_type: '',
    time_period: '',
    channels: [],
    primary_goal: '',
    budget_level: '',
    special_considerations: '',
  })
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const channels = [
    'E-mail',
    'Fysisk brev',
    'Telefon',
    'SMS',
    'Social medie',
    'Events',
    'Personligt møde',
    'Nyhedsbrev',
  ]

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleChannel = (channel: string) => {
    const currentChannels = formData.channels
    if (currentChannels.includes(channel)) {
      updateFormData('channels', currentChannels.filter(c => c !== channel))
    } else {
      updateFormData('channels', [...currentChannels, channel])
    }
  }

  const handleGenerate = async () => {
    setError('')

    // Validation
    if (!formData.donor_type || !formData.time_period || formData.channels.length === 0 || 
        !formData.primary_goal || !formData.budget_level) {
      setError('Udfyld venligst alle påkrævede felter')
      return
    }

    setIsLoading(true)

    try {
      const userMessage = `Generér en stewardship-plan.

Donortype: ${formData.donor_type}
Tidsperiode: ${formData.time_period}
Tilgængelige kanaler: ${formData.channels.join(', ')}
Primært mål: ${formData.primary_goal}
Budget-niveau: ${formData.budget_level}
${formData.special_considerations ? `Særlige hensyn: ${formData.special_considerations}` : ''}`

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: 'stewardship',
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
        'stewardship',
        output,
        `Stewardship-plan: ${formData.donor_type} - ${formData.time_period}`,
        formData
      )
    }
  }

  return (
    <ToolLayout
      toolName="Arv og Testamente"
      toolDescription="Alt hvad du behøver for at starte og udvikle et arvsprogram"
      isLoading={isLoading}
      onGenerate={handleGenerate}
      output={
        output ? (
          <>
            <OutputViewer content={output} />
            <OutputActions
              output={output}
              toolSlug="stewardship"
              inputData={formData}
              onRegenerate={handleGenerate}
              onSave={handleSave}
            />
          </>
        ) : null
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-[#E74C3C]">{error}</p>
        </div>
      )}

      <form className="space-y-6">
        {/* Donor Type */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Donortype <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.donor_type}
            onChange={(e) => updateFormData('donor_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg donortype</option>
            <option value="Førstegangsdonorer">Førstegangsdonorer</option>
            <option value="Faste bidragydere">Faste bidragydere</option>
            <option value="Stordonorer">Stordonorer</option>
            <option value="Virksomhedsdonorer">Virksomhedsdonorer</option>
            <option value="Eventdeltagere">Eventdeltagere</option>
            <option value="Testamentariske givere">Testamentariske givere</option>
            <option value="Frivillige der også donerer">Frivillige der også donerer</option>
          </select>
        </div>

        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Tidsperiode <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.time_period}
            onChange={(e) => updateFormData('time_period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg tidsperiode</option>
            <option value="3 måneder">3 måneder</option>
            <option value="6 måneder">6 måneder</option>
            <option value="12 måneder">12 måneder</option>
          </select>
        </div>

        {/* Channels */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Tilgængelige kanaler <span className="text-[#E74C3C]">*</span>
          </label>
          <div className="space-y-2">
            {channels.map((channel) => (
              <label
                key={channel}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.channels.includes(channel)}
                  onChange={() => toggleChannel(channel)}
                  className="h-4 w-4 text-[#1B4F72] focus:ring-[#1B4F72] border-gray-300 rounded"
                />
                <span className="text-sm text-[#333333]">{channel}</span>
              </label>
            ))}
          </div>
          {formData.channels.length > 0 && (
            <p className="text-xs text-[#1B4F72] mt-2">
              Valgt: {formData.channels.join(', ')}
            </p>
          )}
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Primært mål <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.primary_goal}
            onChange={(e) => updateFormData('primary_goal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg primært mål</option>
            <option value="Fastholdelse">Fastholdelse</option>
            <option value="Opgradering">Opgradering</option>
            <option value="Engagering">Engagering</option>
            <option value="Genaktivering">Genaktivering</option>
            <option value="Tak og anerkendelse">Tak og anerkendelse</option>
          </select>
        </div>

        {/* Budget Level */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Budget-niveau <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.budget_level}
            onChange={(e) => updateFormData('budget_level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg budget-niveau</option>
            <option value="Minimalt (primært digitale kanaler)">Minimalt (primært digitale kanaler)</option>
            <option value="Moderat (blanding)">Moderat (blanding)</option>
            <option value="Omfattende (fuld multichannel)">Omfattende (fuld multichannel)</option>
          </select>
        </div>

        {/* Special Considerations */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Særlige hensyn
          </label>
          <textarea
            rows={3}
            value={formData.special_considerations}
            onChange={(e) => updateFormData('special_considerations', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="Valgfrit: Særlige forhold, eksisterende tiltag, kendte præferencer..."
          />
        </div>
      </form>
    </ToolLayout>
  )
}
