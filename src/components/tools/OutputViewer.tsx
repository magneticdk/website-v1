'use client'

import { useMemo } from 'react'
import { Info } from 'lucide-react'

interface OutputViewerProps {
  content: string
}

export default function OutputViewer({ content }: OutputViewerProps) {
  const formattedContent = useMemo(() => {
    if (!content) return null

    // Split content into lines
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Coaching notes (💡)
      if (line.trim().startsWith('💡')) {
        elements.push(
          <div
            key={key++}
            className="bg-blue-50 border-l-4 border-[#2E75B6] p-4 my-4 rounded-r-md"
          >
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#2E75B6] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#333333]">{line.replace('💡', '').trim()}</p>
            </div>
          </div>
        )
        continue
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-lg font-semibold text-[#333333] mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        )
        continue
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-xl font-semibold text-[#333333] mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        )
        continue
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-2xl font-bold text-[#333333] mt-8 mb-4">
            {line.replace('# ', '')}
          </h1>
        )
        continue
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const listItems: string[] = []
        let j = i
        while (
          j < lines.length &&
          (lines[j].trim().startsWith('- ') || lines[j].trim().startsWith('* '))
        ) {
          listItems.push(lines[j].trim().replace(/^[-*]\s/, ''))
          j++
        }
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-[#333333]">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        )
        i = j - 1
        continue
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems: string[] = []
        let j = i
        while (j < lines.length && /^\d+\.\s/.test(lines[j].trim())) {
          listItems.push(lines[j].trim().replace(/^\d+\.\s/, ''))
          j++
        }
        elements.push(
          <ol key={key++} className="list-decimal list-inside space-y-2 my-4 text-[#333333]">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ol>
        )
        i = j - 1
        continue
      }

      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />)
        continue
      }

      // Regular paragraphs
      elements.push(
        <p
          key={key++}
          className="text-[#333333] leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
        />
      )
    }

    return elements
  }, [content])

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="prose prose-lg max-w-none">{formattedContent}</div>
    </div>
  )
}

/**
 * Format inline markdown: **bold**, *italic*, `code`
 */
function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>') // Code
}
