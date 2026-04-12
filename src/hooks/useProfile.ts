'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { OrganisationProfile } from '@/types'

interface UseProfileReturn {
  profile: OrganisationProfile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<OrganisationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Ikke logget ind')
      }

      const { data, error: fetchError } = await supabase
        .from('organisation_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single<OrganisationProfile>()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No profile found - this is okay for new users
          setProfile(null)
          setError(null)
        } else {
          throw fetchError
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der opstod en fejl')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  }
}
