'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'
import ChatInterface from '@/components/tools/ChatInterface'
import OutputViewer from '@/components/tools/OutputViewer'
import OutputActions from '@/components/tools/OutputActions'
import { useProfile } from '@/hooks/useProfile'
import { useOutputs } from '@/hooks/useOutputs'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function StrategyPage() {
  const { profile } = useProfile()
  const { saveOutput } = useOutputs()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatComplete, setChatComplete] = useState(false)
  const [showGenerateButton, setShowGenerateButton] = useState(false)
  const [strategy, setStrategy] = useState('')
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false)

  // Send initial AI message on load
  useEffect(() => {
    if (profile && messages.length === 0) {
      const initialMessage: Message = {
        role: 'assistant',
        content: `Hej! Jeg er din strategi-coach. Sammen bygger vi en fundraising-strategi for ${profile.name}. Lad os starte.

Først vil jeg gerne høre: Hvad er jeres primære fundraising-mål for det næste år? Tænk både på økonomiske mål (f.eks. samlet indsamlet beløb) og impact-mål (f.eks. antal nye støtter).`,
      }
      setMessages([initialMessage])
    }
  }, [profile, messages.length])

  const handleSendMessage = async (userMessage: string) => {
    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Call AI with chat history
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: 'strategy-chat',
          chat_history: newMessages,
          user_message: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Der opstod en fejl')
      }

      const data = await response.json()
      const aiMessage: Message = {
        role: 'assistant',
        content: data.output,
      }

      setMessages([...newMessages, aiMessage])

      // Check if AI mentioned "Generér strategi" or we've had enough exchanges
      if (
        data.output.toLowerCase().includes('generér strategi') ||
        newMessages.length >= 16
      ) {
        setShowGenerateButton(true)
        setChatComplete(true)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Beklager, der opstod en fejl. Prøv venligst igen.',
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateStrategy = async () => {
    setIsGeneratingStrategy(true)

    try {
      // Create a summary of the conversation for strategy generation
      const conversationSummary = messages
        .map((m) => `${m.role === 'user' ? 'Bruger' : 'AI'}: ${m.content}`)
        .join('\n\n')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: 'strategy-generate',
          user_message: conversationSummary,
        }),
      })

      if (!response.ok) {
        throw new Error('Der opstod en fejl')
      }

      const data = await response.json()
      setStrategy(data.output)
    } catch (error) {
      console.error('Error:', error)
      alert('Der opstod en fejl under generering af strategien. Prøv venligst igen.')
    } finally {
      setIsGeneratingStrategy(false)
    }
  }

  const handleSave = async () => {
    if (strategy) {
      await saveOutput(
        'strategy',
        strategy,
        `Fundraising-strategi for ${profile?.name || 'din organisation'}`,
        { chat_history: messages }
      )
    }
  }

  return (
    <ToolLayout
      toolName="Strategi Arkitekt"
      toolDescription="Byg en evidensbaseret fundraising-strategi"
      output={
        strategy ? (
          <>
            <OutputViewer content={strategy} />
            <OutputActions
              output={strategy}
              toolSlug="strategy"
              onSave={handleSave}
            />
          </>
        ) : null
      }
    >
      <div className="h-[600px] flex flex-col">
        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={chatComplete}
          />
        </div>

        {/* Generate Strategy Button */}
        {showGenerateButton && !strategy && (
          <div className="mt-4">
            <button
              onClick={handleGenerateStrategy}
              disabled={isGeneratingStrategy}
              className="w-full bg-[#27AE60] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#229954] focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGeneratingStrategy ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Genererer strategi...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generér strategi
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
