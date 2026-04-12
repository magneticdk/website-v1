import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface AnalyzeRequest {
  headers: string[]
  rowCount: number
  sampleRows: string[][]
  dataType: string
  tasks: string[]
  additionalInstructions?: string
}

interface DataIssue {
  row: number
  column: string
  current_value: string
  issue: string
  severity: 'critical' | 'warning' | 'suggestion'
  fix: string
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
    const body: AnalyzeRequest = await request.json()
    const { headers, rowCount, sampleRows, dataType, tasks, additionalInstructions } = body

    if (!headers || !sampleRows || !dataType || !tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: 'Manglende påkrævede felter' },
        { status: 400 }
      )
    }

    // 3. Construct analysis prompt
    const tasksDescription = tasks.join('\n- ')
    const sampleData = sampleRows.slice(0, 100).map((row, index) => {
      return `Række ${index + 1}: ${row.join(' | ')}`
    }).join('\n')

    const userMessage = `Analysér dette ${dataType.toLowerCase()}-datasæt.

**Kolonner:** ${headers.join(', ')}
**Totalt antal rækker:** ${rowCount}
**Opgaver:**
- ${tasksDescription}

${additionalInstructions ? `**Yderligere instruktioner:** ${additionalInstructions}` : ''}

**Dataeksempel (første ${Math.min(100, sampleRows.length)} rækker):**
${sampleData}

Find alle problemer i datasættet baseret på opgaverne. For hvert problem, returnér JSON i dette format:
[
  {
    "row": <række nummer>,
    "column": "<kolonnenavn>",
    "current_value": "<nuværende værdi>",
    "issue": "<beskrivelse af problemet>",
    "severity": "critical|warning|suggestion",
    "fix": "<foreslået rettelse>"
  }
]

Vær grundig men realistisk. Fokuser på de mest kritiske problemer først. Returnér kun JSON-arrayet uden yderligere forklaring.`

    // 4. Call Anthropic Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: `Du er en dataoperations specialist specialiseret i nonprofit-data (donorer, medlemmer, kontakter). 

Du analyserer datasæt og identificerer problemer som:
- Manglende eller ufuldstændige felter
- Duplikater (baseret på e-mail, telefon, navn+adresse)
- Ugyldige e-mailadresser (format)
- Ugyldige telefonnumre (dansk format: +45 eller 8 cifre)
- Inkonsistente datoformater
- Inkonsistente adresser (postnumre, bynavne)
- Ulogiske værdier (negative beløb, fremtidige fødselsdatoer, etc.)

Vær præcis, struktureret og konkret i dine anbefalinger. Alle output skal være på dansk.`,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const outputText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''

    // 5. Parse JSON from Claude's response
    let issues: DataIssue[] = []
    try {
      // Extract JSON from response (Claude might wrap it in markdown)
      const jsonMatch = outputText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        issues = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Kunne ikke finde JSON i svar')
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', outputText)
      return NextResponse.json(
        { error: 'Kunne ikke parse AI-svar. Prøv venligst igen.' },
        { status: 500 }
      )
    }

    // 6. Log usage
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens
    await supabase.from('usage_log').insert({
      user_id: user.id,
      tool_slug: 'data-cleansing',
      tokens_used: tokensUsed,
    })

    // 7. Return issues
    return NextResponse.json({
      issues,
      summary: {
        total: issues.length,
        critical: issues.filter(i => i.severity === 'critical').length,
        warnings: issues.filter(i => i.severity === 'warning').length,
        suggestions: issues.filter(i => i.severity === 'suggestion').length,
      },
    })
  } catch (error) {
    console.error('Error in /api/analyze-data:', error)

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI API fejl: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Der opstod en fejl under analyse af data. Prøv venligst igen.' },
      { status: 500 }
    )
  }
}
