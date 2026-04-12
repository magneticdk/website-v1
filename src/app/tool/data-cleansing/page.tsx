'use client'

import { useState } from 'react'
import { Download, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import * as XLSX from 'xlsx'
import ToolLayout from '@/components/tools/ToolLayout'
import FileUploader from '@/components/tools/FileUploader'

interface ParsedData {
  headers: string[]
  rows: string[][]
  fileName: string
  fileSize: number
  rowCount: number
}

interface DataIssue {
  row: number
  column: string
  current_value: string
  issue: string
  severity: 'critical' | 'warning' | 'suggestion'
  fix: string
  approved?: boolean
}

interface AnalysisSummary {
  total: number
  critical: number
  warnings: number
  suggestions: number
}

export default function DataCleansingPage() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [dataType, setDataType] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [issues, setIssues] = useState<DataIssue[]>([])
  const [summary, setSummary] = useState<AnalysisSummary | null>(null)
  const [error, setError] = useState('')

  const tasks = [
    'Find ufuldstændige poster (manglende felter)',
    'Find duplikater',
    'Valider e-mailadresser',
    'Valider telefonnumre (dansk format)',
    'Standardiser datoformater',
    'Standardiser adresser',
    'Find ulogiske værdier',
  ]

  const toggleTask = (task: string) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task))
    } else {
      setSelectedTasks([...selectedTasks, task])
    }
  }

  const handleAnalyze = async () => {
    if (!parsedData) {
      setError('Upload venligst en fil først')
      return
    }

    if (!dataType) {
      setError('Vælg en datatype')
      return
    }

    if (selectedTasks.length === 0) {
      setError('Vælg mindst én opgave')
      return
    }

    setError('')
    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headers: parsedData.headers,
          rowCount: parsedData.rowCount,
          sampleRows: parsedData.rows.slice(0, 100),
          dataType,
          tasks: selectedTasks,
          additionalInstructions,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Der opstod en fejl')
      }

      const data = await response.json()
      setIssues(data.issues.map((issue: DataIssue) => ({ ...issue, approved: false })))
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleIssueApproval = (index: number) => {
    const newIssues = [...issues]
    newIssues[index].approved = !newIssues[index].approved
    setIssues(newIssues)
  }

  const approveAll = () => {
    setIssues(issues.map(issue => ({ ...issue, approved: true })))
  }

  const approveCritical = () => {
    setIssues(issues.map(issue => 
      issue.severity === 'critical' ? { ...issue, approved: true } : issue
    ))
  }

  const handleExport = () => {
    if (!parsedData) return

    // Apply approved fixes
    const fixedRows = [...parsedData.rows]
    const approvedIssues = issues.filter(issue => issue.approved)

    approvedIssues.forEach(issue => {
      const rowIndex = issue.row - 1
      const columnIndex = parsedData.headers.indexOf(issue.column)
      
      if (rowIndex >= 0 && rowIndex < fixedRows.length && columnIndex >= 0) {
        fixedRows[rowIndex][columnIndex] = issue.fix
      }
    })

    // Create new workbook
    const wb = XLSX.utils.book_new()
    const wsData = [parsedData.headers, ...fixedRows]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Renset data')

    // Download
    const fileName = parsedData.fileName.replace(/\.[^/.]+$/, '') + '_renset.xlsx'
    XLSX.writeFile(wb, fileName)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-[#E74C3C]" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'suggestion':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    const styles = {
      critical: 'bg-red-100 text-[#E74C3C] border-red-200',
      warning: 'bg-orange-100 text-orange-700 border-orange-200',
      suggestion: 'bg-blue-100 text-blue-700 border-blue-200',
    }
    return styles[severity as keyof typeof styles] || styles.suggestion
  }

  return (
    <ToolLayout
      toolName="Datarensning & Formatering"
      toolDescription="Rens og formater donor- og medlemsdata"
      output={
        summary && issues.length > 0 ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">
                Analyseresultat
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#333333]">{summary.total}</p>
                  <p className="text-sm text-[#718096]">Problemer fundet</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#E74C3C]">{summary.critical}</p>
                  <p className="text-sm text-[#718096]">Kritiske</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">{summary.warnings}</p>
                  <p className="text-sm text-[#718096]">Advarsler</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">{summary.suggestions}</p>
                  <p className="text-sm text-[#718096]">Forslag</p>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={approveAll}
                  className="px-4 py-2 bg-[#27AE60] text-white rounded-md hover:bg-[#229954] transition-colors text-sm font-medium"
                >
                  Godkend alle
                </button>
                <button
                  onClick={approveCritical}
                  className="px-4 py-2 border border-[#E74C3C] text-[#E74C3C] rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Godkend kun kritiske
                </button>
                <button
                  onClick={handleExport}
                  disabled={!issues.some(i => i.approved)}
                  className="ml-auto px-4 py-2 bg-[#1B4F72] text-white rounded-md hover:bg-[#15395a] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Implementér rettelser & eksportér
                </button>
              </div>
            </div>

            {/* Issues List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold text-[#333333]">Fundne problemer</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-4 flex items-start gap-3 ${
                      issue.approved ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={issue.approved}
                      onChange={() => toggleIssueApproval(index)}
                      className="mt-1 h-4 w-4 text-[#27AE60] focus:ring-[#27AE60] border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getSeverityIcon(issue.severity)}
                        <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityBadge(issue.severity)}`}>
                          {issue.severity === 'critical' && 'Kritisk'}
                          {issue.severity === 'warning' && 'Advarsel'}
                          {issue.severity === 'suggestion' && 'Forslag'}
                        </span>
                        <span className="text-sm text-[#718096]">
                          Række {issue.row} • {issue.column}
                        </span>
                      </div>
                      <p className="text-sm text-[#333333] mb-2">{issue.issue}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#718096]">Nuværende værdi:</span>
                          <p className="font-mono text-[#E74C3C] mt-1">
                            {issue.current_value || <em className="text-[#718096]">tom</em>}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#718096]">Foreslået rettelse:</span>
                          <p className="font-mono text-[#27AE60] mt-1">{issue.fix}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null
      }
    >
      <form className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-[#E74C3C]">{error}</p>
          </div>
        )}

        {/* File Uploader */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Upload datafil <span className="text-[#E74C3C]">*</span>
          </label>
          <FileUploader onFileUploaded={setParsedData} />
        </div>

        {/* Data Type */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Datatype <span className="text-[#E74C3C]">*</span>
          </label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            required
          >
            <option value="">Vælg datatype</option>
            <option value="Donordata">Donordata</option>
            <option value="Medlemsdata">Medlemsdata</option>
            <option value="Kontaktliste">Kontaktliste</option>
            <option value="Eventdeltagere">Eventdeltagere</option>
            <option value="Andet">Andet</option>
          </select>
        </div>

        {/* Tasks Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Hvad skal renses? <span className="text-[#E74C3C]">*</span>
          </label>
          <div className="space-y-2">
            {tasks.map((task) => (
              <label
                key={task}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task)}
                  onChange={() => toggleTask(task)}
                  className="h-4 w-4 text-[#1B4F72] focus:ring-[#1B4F72] border-gray-300 rounded"
                />
                <span className="text-sm text-[#333333]">{task}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Instructions */}
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">
            Yderligere instruktioner
          </label>
          <textarea
            rows={3}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="Valgfrit: Beskriv specifikke problemer eller særlige krav..."
          />
        </div>

        {/* Analyze Button */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !parsedData}
          className="w-full bg-[#27AE60] text-white font-medium py-3 px-6 rounded-md hover:bg-[#229954] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyserer data...
            </>
          ) : (
            'Rense data'
          )}
        </button>
      </form>
    </ToolLayout>
  )
}
