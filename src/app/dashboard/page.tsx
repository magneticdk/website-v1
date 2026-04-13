'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  PenTool,
  Target,
  Database,
  Heart,
  Map,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/useProfile'
import { Output, ToolConfig } from '@/types'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const tools: ToolConfig[] = [
  {
    slug: 'copywriter',
    name: 'Fundraising Tekstforfatter',
    description: 'Skriv appeller, e-mails og breve der virker',
    icon: 'PenTool',
  },
  {
    slug: 'strategy',
    name: 'Strategi Arkitekt',
    description: 'Byg en evidensbaseret fundraising-strategi',
    icon: 'Target',
  },
  {
    slug: 'data-cleansing',
    name: 'Datarensning & Formatering',
    description: 'Rens og formater donor- og medlemsdata',
    icon: 'Database',
  },
  {
    slug: 'stewardship',
    name: 'Arv og Testamente',
    description: 'Alt hvad du behøver for at starte og udvikle et arvsprogram',
    icon: 'Heart',
  },
  {
    slug: 'journey',
    name: 'Støtterrejse Designer',
    description: 'Kortlæg og forbedr de rejser, dine støtter foretager',
    icon: 'Map',
  },
  {
    slug: 'case-builder',
    name: 'Søg fonde eller partnerskabe',
    description: 'Skab en overbevisende sag for støtte',
    icon: 'FileText',
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenTool,
  Target,
  Database,
  Heart,
  Map,
  FileText,
}

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useProfile()
  const [userName, setUserName] = useState<string>('')
  const [recentOutputs, setRecentOutputs] = useState<Output[]>([])
  const [loadingOutputs, setLoadingOutputs] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const name = user.user_metadata?.name || 'Bruger'
        setUserName(name)

        // Load recent outputs
        const { data: outputs } = await supabase
          .from('outputs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (outputs) {
          setRecentOutputs(outputs)
        }
      }
      setLoadingOutputs(false)
    }

    loadUserData()
  }, [])

  const calculateProfileCompletion = (): number => {
    if (!profile) return 0

    const fields = [
      profile.name,
      profile.cvr_number,
      profile.website_url,
      profile.mission,
      profile.programs,
      profile.target_audience,
      profile.geographic_focus,
      profile.key_messages,
      profile.brand_voice,
      profile.annual_income,
      profile.logo_url,
    ]

    const filledFields = fields.filter((field) => field && field.trim()).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const profileCompletion = calculateProfileCompletion()
  const showCompletionBanner = profileCompletion < 70

  const getToolNameFromSlug = (slug: string): string => {
    const tool = tools.find((t) => t.slug === slug)
    return tool?.name || slug
  }

  const getToolIconFromSlug = (slug: string): React.ComponentType<{ className?: string }> => {
    const tool = tools.find((t) => t.slug === slug)
    return tool ? iconMap[tool.icon] : FileText
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />

        <main className="flex-1 p-6 space-y-8">
          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">
              Velkommen, {userName}
            </h1>
            {profile && (
              <p className="text-lg text-[#718096] mt-1">{profile.name}</p>
            )}
          </div>

          {/* Profile Completion Banner */}
          {showCompletionBanner && !profileLoading && profile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#2E75B6] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#333333]">
                  Din profil er kun <strong>{profileCompletion}% komplet</strong>.
                  Jo mere vi ved om din organisation, jo bedre bliver AI-resultaterne.
                </p>
                <div className="mt-3 mb-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-[#2E75B6] h-2 rounded-full transition-all"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-[#2E75B6] hover:underline inline-flex items-center gap-1 mt-2"
                >
                  Fuldfør profil <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-4">
              AI Værktøjer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const Icon = iconMap[tool.icon]
                return (
                  <div
                    key={tool.slug}
                    className="bg-white rounded-lg shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-[#1B4F72]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#333333] mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-[#718096]">{tool.description}</p>
                    </div>
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/tool/${tool.slug}`}
                        className="block w-full text-center px-4 py-2 bg-[#27AE60] text-white rounded-md hover:bg-[#229954] transition-colors font-medium"
                      >
                        Åbn værktøj
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Outputs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#333333]">
                Seneste outputs
              </h2>
              {recentOutputs.length > 0 && (
                <Link
                  href="/library"
                  className="text-sm font-medium text-[#1B4F72] hover:underline inline-flex items-center gap-1"
                >
                  Se alle <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {loadingOutputs ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-[#718096]">Indlæser outputs...</p>
              </div>
            ) : recentOutputs.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="w-8 h-8 text-[#1B4F72]" />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">
                  Du har ikke brugt nogen værktøjer endnu
                </h3>
                <p className="text-[#718096] mb-4">
                  Start med Fundraising Tekstforfatter — det er det letteste sted
                  at begynde!
                </p>
                <Link
                  href="/tool/copywriter"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#27AE60] text-white rounded-md hover:bg-[#229954] transition-colors font-medium"
                >
                  Start nu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              // Recent Outputs List
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                {recentOutputs.map((output) => {
                  const Icon = getToolIconFromSlug(output.tool_slug)
                  const preview =
                    output.output_text.substring(0, 100) +
                    (output.output_text.length > 100 ? '...' : '')

                  return (
                    <Link
                      key={output.id}
                      href={`/library?id=${output.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#1B4F72]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-[#1B4F72]">
                                {getToolNameFromSlug(output.tool_slug)}
                              </p>
                              {output.title && (
                                <p className="text-sm font-semibold text-[#333333] mt-0.5">
                                  {output.title}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-[#718096] flex-shrink-0">
                              {formatDate(output.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-[#718096] mt-1 line-clamp-2">
                            {preview}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
