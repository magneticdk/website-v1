'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  PenTool,
  Target,
  Database,
  Heart,
  Map,
  FileText,
  Trash2,
  X,
  Filter,
} from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import OutputViewer from '@/components/tools/OutputViewer'
import OutputActions from '@/components/tools/OutputActions'
import { useOutputs } from '@/hooks/useOutputs'
import { Output } from '@/types'

const toolIcons: Record<string, { icon: React.ComponentType<{ className?: string }>, name: string, color: string }> = {
  copywriter: { icon: PenTool, name: 'Tekstforfatter', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  strategy: { icon: Target, name: 'Strategi Arkitekt', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'data-cleansing': { icon: Database, name: 'Datarensning', color: 'bg-green-100 text-green-700 border-green-200' },
  stewardship: { icon: Heart, name: 'Arv og Testamente', color: 'bg-red-100 text-red-700 border-red-200' },
  journey: { icon: Map, name: 'Støtterejse', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'case-builder': { icon: FileText, name: 'Case Builder', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
}

export default function LibraryPage() {
  const searchParams = useSearchParams()
  const { outputs, loading, getOutputs, deleteOutput } = useOutputs()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTool, setFilterTool] = useState<string>('all')
  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    getOutputs()
  }, [getOutputs])

  // Check if there's an ID in URL params to auto-open
  useEffect(() => {
    const outputId = searchParams.get('id')
    if (outputId && outputs.length > 0) {
      const output = outputs.find(o => o.id === outputId)
      if (output) {
        setSelectedOutput(output)
      }
    }
  }, [searchParams, outputs])

  const filteredOutputs = useMemo(() => {
    let filtered = outputs

    // Filter by tool
    if (filterTool !== 'all') {
      filtered = filtered.filter(output => output.tool_slug === filterTool)
    }

    // Search in title and output text
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(output => 
        (output.title?.toLowerCase().includes(query)) ||
        output.output_text.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [outputs, filterTool, searchQuery])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getWordCount = (text: string): number => {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  const handleDelete = async (id: string) => {
    const success = await deleteOutput(id)
    if (success) {
      setDeleteConfirmId(null)
      if (selectedOutput?.id === id) {
        setSelectedOutput(null)
      }
    }
  }

  const getToolInfo = (toolSlug: string) => {
    return toolIcons[toolSlug] || { icon: FileText, name: toolSlug, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Dit bibliotek" />

        <main className="flex-1 p-6">
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søg i dine outputs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <select
                value={filterTool}
                onChange={(e) => setFilterTool(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72] appearance-none bg-white"
              >
                <option value="all">Alle værktøjer</option>
                <option value="copywriter">Tekstforfatter</option>
                <option value="strategy">Strategi Arkitekt</option>
                <option value="data-cleansing">Datarensning</option>
                <option value="stewardship">Arv og Testamente</option>
                <option value="journey">Støtterejse</option>
                <option value="case-builder">Case Builder</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#718096]">Indlæser outputs...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOutputs.length === 0 && !searchQuery && filterTool === 'all' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#1B4F72]" />
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Dit bibliotek er tomt
              </h3>
              <p className="text-[#718096]">
                Gem outputs fra værktøjerne, så du kan finde dem her.
              </p>
            </div>
          )}

          {/* No Results State */}
          {!loading && filteredOutputs.length === 0 && (searchQuery || filterTool !== 'all') && (
            <div className="text-center py-12">
              <p className="text-[#718096]">Ingen outputs matcher din søgning</p>
            </div>
          )}

          {/* Output Grid */}
          {!loading && filteredOutputs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOutputs.map((output) => {
                const toolInfo = getToolInfo(output.tool_slug)
                const Icon = toolInfo.icon
                const preview = output.title || output.output_text.substring(0, 80) + '...'

                return (
                  <div
                    key={output.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Tool Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${toolInfo.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {toolInfo.name}
                      </span>
                    </div>

                    {/* Title/Preview */}
                    <h3 className="text-base font-semibold text-[#333333] mb-2 line-clamp-2">
                      {preview}
                    </h3>

                    {/* Meta */}
                    <div className="text-xs text-[#718096] mb-4 space-y-1">
                      <p>{formatDate(output.created_at)}</p>
                      <p>{getWordCount(output.output_text).toLocaleString('da-DK')} ord</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => setSelectedOutput(output)}
                        className="flex-1 px-4 py-2 bg-[#1B4F72] text-white text-sm rounded-md hover:bg-[#15395a] transition-colors"
                      >
                        Åbn
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(output.id)}
                        className="px-4 py-2 border border-[#E74C3C] text-[#E74C3C] text-sm rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Output Modal */}
      {selectedOutput && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="mb-2">
                  {(() => {
                    const toolInfo = getToolInfo(selectedOutput.tool_slug)
                    const Icon = toolInfo.icon
                    return (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${toolInfo.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {toolInfo.name}
                      </span>
                    )
                  })()}
                </div>
                <h2 className="text-xl font-semibold text-[#333333]">
                  {selectedOutput.title || 'Output'}
                </h2>
                <p className="text-sm text-[#718096] mt-1">
                  {formatDate(selectedOutput.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOutput(null)}
                className="text-[#718096] hover:text-[#333333] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <OutputViewer content={selectedOutput.output_text} />
            </div>

            {/* Modal Actions */}
            <OutputActions
              output={selectedOutput.output_text}
              toolSlug={selectedOutput.tool_slug}
              inputData={selectedOutput.input_data as Record<string, unknown> | undefined}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-2">
              Slet output?
            </h3>
            <p className="text-[#718096] mb-6">
              Er du sikker på at du vil slette dette output? Denne handling kan ikke fortrydes.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 text-[#333333] rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuller
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-[#E74C3C] text-white rounded-md hover:bg-[#c0392b] transition-colors"
              >
                Slet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
