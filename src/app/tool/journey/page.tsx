'use client'

import { useState, FormEvent } from 'react'
import ToolLayout from '@/components/tools/ToolLayout'
import OutputViewer from '@/components/tools/OutputViewer'
import OutputActions from '@/components/tools/OutputActions'
import { useOutputs } from '@/hooks/useOutputs'

interface FormData {
  journey_type: string
  entry_point: string
  end_goal: string
  timeframe: string
  channels: string[]
  context: string
}

export default function JourneyPage() {
  const { saveOutput } = useOutputs()
  const [formData, setFormData] = useState<FormData>({
    journey_type: '',
    entry_point: '',
    end_goal: '',
    timeframe: '',
    channels: [],
    context: '',
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
    'Hjemmeside',
    'Personligt møde',
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
    if (!formData.journey_type || !formData.entry_point || !formData.end_goal || 
        !formData.timeframe || formData.channels.length === 0) {
      setError('Udfyld venligst alle påkrævede felter')
      return
    }

    setIsLoading(true)

    try {
      const userMessage = `Generér en støtterejse.

Rejsetype: ${formData.journey_type}
Indgangspunkt: ${formData.entry_point}
Slutmål: ${formData.end_goal}
Tidshorisont: ${formData.timeframe}
Tilgængelige kanaler: ${formData.channels.join(', ')}
${formData.context ? `Yderligere kontekst: ${formData.context}` : ''}`

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: 'journey',
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
        'journey',
        output,
        `${formData.journey_type} - ${formData.entry_point} til ${formData.end_goal}`,
        formData
      )
    }
  }

  return (
    <ToolLayout
      toolName="Støtterrejse Designer"
      toolDescription="Kortlæg og forbedr de rejser, dine støtter foretager"
      isLoading={isLoading}
      onGenerate={handleGenerate}
      output={
        output ? (
          <>
            <OutputViewer content={output} />
            <OutputActions
              output={output}
              toolSlug="journey"
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
        {/* Journey Type */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Rejsetype <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.journey_type}
            onChange={(e) => updateFormData('journey_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg rejsetype</option>
            <option value="Ny donor-rejse">Ny donor-rejse</option>
            <option value="Opgraderingsrejse">Opgraderingsrejse</option>
            <option value="Genaktiveringsrejse">Genaktiveringsrejse</option>
            <option value="Frivillig-til-donor">Frivillig-til-donor</option>
            <option value="Event-deltager-til-støtter">Event-deltager-til-støtter</option>
            <option value="Stordonor-rejse">Stordonor-rejse</option>
          </select>
        </div>

        {/* Entry Point */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Indgangspunkt <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.entry_point}
            onChange={(e) => updateFormData('entry_point', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg indgangspunkt</option>
            <option value="Hjemmeside-besøg">Hjemmeside-besøg</option>
            <option value="Social medie">Social medie</option>
            <option value="Event">Event</option>
            <option value="Anbefaling fra ven">Anbefaling fra ven</option>
            <option value="Direct mail">Direct mail</option>
            <option value="Google-søgning">Google-søgning</option>
            <option value="Presseomtale">Presseomtale</option>
          </select>
        </div>

        {/* End Goal */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Slutmål <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.end_goal}
            onChange={(e) => updateFormData('end_goal', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg slutmål</option>
            <option value="Fast månedlig giver">Fast månedlig giver</option>
            <option value="Årlig storgiver">Årlig storgiver</option>
            <option value="Aktiv frivillig + donor">Aktiv frivillig + donor</option>
            <option value="Testamentarisk giver">Testamentarisk giver</option>
            <option value="Fundraising-ambassadør">Fundraising-ambassadør</option>
          </select>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Tidshorisont <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={formData.timeframe}
            onChange={(e) => updateFormData('timeframe', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg tidshorisont</option>
            <option value="3 måneder">3 måneder</option>
            <option value="6 måneder">6 måneder</option>
            <option value="12 måneder">12 måneder</option>
            <option value="24 måneder">24 måneder</option>
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

        {/* Additional Context */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Yderligere kontekst
          </label>
          <textarea
            rows={3}
            value={formData.context}
            onChange={(e) => updateFormData('context', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="Valgfrit: Særlige hensyn, eksisterende processer, udfordringer..."
          />
        </div>
      </form>
    </ToolLayout>
  )
}
