'use client'

import { useState } from 'react'
import { BookmarkPlus, Copy, RefreshCw, Download, Check } from 'lucide-react'

interface OutputActionsProps {
  output: string
  toolSlug: string
  inputData?: Record<string, unknown>
  onRegenerate?: () => void
  onSave?: () => void
}

export default function OutputActions({
  output,
  toolSlug,
  inputData,
  onRegenerate,
  onSave,
}: OutputActionsProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!output) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSave = async () => {
    if (onSave) {
      onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleExportWord = () => {
    // Create a Blob with the output text
    const blob = new Blob([output], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${toolSlug}-output.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    // Placeholder for PDF export
    alert('PDF eksport kommer snart')
  }

  return (
    <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-[#27AE60]" />
              Gemt
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              Gem
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#27AE60]" />
              Kopieret
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Kopiér
            </>
          )}
        </button>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerér
          </button>
        )}
      </div>

      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors">
          <Download className="w-4 h-4" />
          Eksportér
        </button>

        {/* Dropdown */}
        <div className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <button
            onClick={handleExportWord}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-[#333333] first:rounded-t-md"
          >
            Word (.doc)
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-[#333333] last:rounded-b-md"
          >
            PDF (.pdf)
          </button>
        </div>
      </div>
    </div>
  )
}
