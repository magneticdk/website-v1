'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { OrganisationProfile } from '@/types'

interface HeaderProps {
  title?: string
}

export default function Header({ title }: HeaderProps) {
  const [organisationName, setOrganisationName] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('organisation_profiles')
          .select('name')
          .eq('user_id', user.id)
          .single<Pick<OrganisationProfile, 'name'>>()

        if (profile) {
          setOrganisationName(profile.name)
        }
      }
    }

    loadProfile()
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            {title && (
              <h1 className="text-2xl font-semibold text-[#333333]">{title}</h1>
            )}
          </div>

          {/* Organisation Name */}
          {organisationName && (
            <div className="hidden md:block">
              <p className="text-sm text-[#718096]">Organisation</p>
              <p className="text-base font-medium text-[#333333]">
                {organisationName}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
