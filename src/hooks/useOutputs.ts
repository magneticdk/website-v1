'use client'

import { useState, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Output } from '@/types'

interface UseOutputsReturn {
  outputs: Output[]
  loading: boolean
  error: string | null
  saveOutput: (
    toolSlug: string,
    outputText: string,
    title?: string,
    inputData?: Record<string, unknown>
  ) => Promise<Output | null>
  getOutputs: (toolSlug?: string) => Promise<void>
  deleteOutput: (id: string) => Promise<boolean>
}

export function useOutputs(): UseOutputsReturn {
  const [outputs, setOutputs] = useState<Output[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveOutput = useCallback(
    async (
      toolSlug: string,
      outputText: string,
      title?: string,
      inputData?: Record<string, unknown>
    ): Promise<Output | null> => {
      try {
        setError(null)

        const supabase = createBrowserClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('Ikke logget ind')
        }

        const { data, error: insertError } = await supabase
          .from('outputs')
          .insert({
            user_id: user.id,
            tool_slug: toolSlug,
            title: title || null,
            input_data: inputData || null,
            output_text: outputText,
          })
          .select()
          .single<Output>()

        if (insertError) throw insertError

        // Add to local state
        setOutputs((prev) => [data, ...prev])

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Der opstod en fejl'
        setError(errorMessage)
        return null
      }
    },
    []
  )

  const getOutputs = useCallback(async (toolSlug?: string): Promise<void> => {
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

      let query = supabase
        .from('outputs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Filter by tool slug if provided
      if (toolSlug) {
        query = query.eq('tool_slug', toolSlug)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setOutputs(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Der opstod en fejl'
      setError(errorMessage)
      setOutputs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteOutput = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)

      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Ikke logget ind')
      }

      const { error: deleteError } = await supabase
        .from('outputs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Remove from local state
      setOutputs((prev) => prev.filter((output) => output.id !== id))

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Der opstod en fejl'
      setError(errorMessage)
      return false
    }
  }, [])

  return {
    outputs,
    loading,
    error,
    saveOutput,
    getOutputs,
    deleteOutput,
  }
}
