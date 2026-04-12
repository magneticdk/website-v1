import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'
import { getSystemPrompt } from '@/lib/ai/prompts'
import { OrganisationProfile } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GenerateRequest {
  tool_slug: string
  input_data?: Record<string, unknown>
  chat_history?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  user_message?: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Ikke autoriseret. Log venligst ind.' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body: GenerateRequest = await request.json()
    const { tool_slug, input_data, chat_history, user_message } = body

    if (!tool_slug) {
      return NextResponse.json(
        { error: 'tool_slug er påkrævet' },
        { status: 400 }
      )
    }

    // 3. Load user's organisation profile
    const { data: profile } = await supabase
      .from('organisation_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single<OrganisationProfile>()

    // 4. Construct system prompt
    const systemPrompt = getSystemPrompt(tool_slug, profile)

    // 5. Prepare user message
    let finalUserMessage = user_message || ''

    // If input_data is provided, format it into the message
    if (input_data && Object.keys(input_data).length > 0) {
      const inputContext = Object.entries(input_data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
      finalUserMessage = `${finalUserMessage}\n\nInput data:\n${inputContext}`
    }

    if (!finalUserMessage.trim()) {
      return NextResponse.json(
        { error: 'Brugerbesked er påkrævet' },
        { status: 400 }
      )
    }

    // 6. Call Anthropic Claude API
    const messages: Anthropic.MessageParam[] = []

    // Add chat history if provided (for conversational tools like Strategy)
    if (chat_history && chat_history.length > 0) {
      chat_history.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      })
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: finalUserMessage,
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    })

    const outputText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''

    // 7. Log usage to usage_log table
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens

    await supabase.from('usage_log').insert({
      user_id: user.id,
      tool_slug,
      tokens_used: tokensUsed,
    })

    // 8. Return generated text
    return NextResponse.json({
      output: outputText,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        total_tokens: tokensUsed,
      },
    })
  } catch (error) {
    console.error('Error in /api/generate:', error)

    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI API fejl: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    // Generic error
    return NextResponse.json(
      { error: 'Der opstod en fejl under generering af tekst. Prøv venligst igen.' },
      { status: 500 }
    )
  }
}
