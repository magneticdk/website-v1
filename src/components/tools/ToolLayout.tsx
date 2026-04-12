'use client'

import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

interface ToolLayoutProps {
  toolName: string
  toolDescription: string
  children: ReactNode
  output?: ReactNode
  isLoading?: boolean
  onGenerate?: () => void
}

export default function ToolLayout({
  toolName,
  toolDescription,
  children,
  output,
  isLoading = false,
  onGenerate,
}: ToolLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={toolName} />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Input Form */}
          <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <p className="text-sm text-[#718096]">{toolDescription}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">{children}</div>
            </div>

            {onGenerate && (
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="w-full bg-[#27AE60] text-white font-medium py-3 px-6 rounded-md hover:bg-[#229954] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Genererer...
                    </>
                  ) : (
                    'Generér'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Output Display */}
          <div className="w-full lg:w-3/5 bg-[#F5F7FA] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#1B4F72] mx-auto mb-4" />
                    <p className="text-[#718096] text-lg">Genererer...</p>
                  </div>
                </div>
              ) : output ? (
                <div className="max-w-4xl mx-auto">{output}</div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <span className="text-3xl">✨</span>
                    </div>
                    <p className="text-[#718096] text-lg">
                      Dit output vises her når du klikker Generér
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
