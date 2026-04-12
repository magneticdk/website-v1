'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileSpreadsheet } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface ParsedData {
  headers: string[]
  rows: string[][]
  fileName: string
  fileSize: number
  rowCount: number
}

interface FileUploaderProps {
  onFileUploaded: (data: ParsedData) => void
}

export default function FileUploader({ onFileUploaded }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const parseFile = useCallback(async (uploadedFile: File) => {
    setError('')

    try {
      const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase()

      if (fileExtension === 'csv') {
        // Parse CSV with papaparse
        Papa.parse(uploadedFile, {
          complete: (results) => {
            const data = results.data as string[][]
            if (data.length === 0) {
              setError('Filen er tom')
              return
            }

            const headers = data[0]
            const rows = data.slice(1).filter(row => row.some(cell => cell.trim()))

            const parsed: ParsedData = {
              headers,
              rows,
              fileName: uploadedFile.name,
              fileSize: uploadedFile.size,
              rowCount: rows.length,
            }

            setParsedData(parsed)
            onFileUploaded(parsed)
          },
          error: (err) => {
            setError(`Kunne ikke parse CSV: ${err.message}`)
          },
        })
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Parse Excel with xlsx
        const arrayBuffer = await uploadedFile.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

        if (jsonData.length === 0) {
          setError('Filen er tom')
          return
        }

        const headers = jsonData[0]
        const rows = jsonData.slice(1).filter(row => row.some(cell => cell))

        const parsed: ParsedData = {
          headers,
          rows,
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          rowCount: rows.length,
        }

        setParsedData(parsed)
        onFileUploaded(parsed)
      } else {
        setError('Ugyldigt filformat. Upload venligst .csv eller .xlsx')
      }
    } catch (err) {
      setError('Kunne ikke læse filen')
    }
  }, [onFileUploaded])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      parseFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setParsedData(null)
    setError('')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      {!parsedData ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-[#1B4F72] bg-blue-50'
              : 'border-gray-300 hover:border-[#1B4F72]'
          }`}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#333333] font-medium mb-1">
              Træk og slip din fil her
            </p>
            <p className="text-sm text-[#718096] mb-4">
              eller klik for at vælge fil
            </p>
            <p className="text-xs text-[#718096]">
              Understøtter .csv og .xlsx (max 10 MB)
            </p>
          </label>
        </div>
      ) : (
        <>
          {/* File Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-[#1B4F72] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#333333]">
                    {parsedData.fileName}
                  </p>
                  <p className="text-sm text-[#718096] mt-1">
                    {formatFileSize(parsedData.fileSize)} • {parsedData.rowCount.toLocaleString('da-DK')} rækker • {parsedData.headers.length} kolonner
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-[#E74C3C] hover:text-[#c0392b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Table */}
          <div>
            <h4 className="text-sm font-medium text-[#333333] mb-2">
              Forhåndsvisning (første 10 rækker)
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-[#718096] uppercase tracking-wider">
                      #
                    </th>
                    {parsedData.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-3 py-2 text-left text-xs font-medium text-[#718096] uppercase tracking-wider"
                      >
                        {header || `Kolonne ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.rows.slice(0, 10).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-[#718096]">
                        {rowIndex + 1}
                      </td>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-3 py-2 whitespace-nowrap text-[#333333]"
                        >
                          {cell || <span className="text-[#718096] italic">tom</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-[#E74C3C]">{error}</p>
        </div>
      )}
    </div>
  )
}
