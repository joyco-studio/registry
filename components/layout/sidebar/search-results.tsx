'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export type SearchResult = {
  id: string
  url: string
  type: 'page' | 'heading' | 'text'
  content: string
}

type SearchResultsProps = {
  results: SearchResult[]
  query: string
}

/* -------------------------------------------------------------------------------------------------
 * HighlightedText
 * -------------------------------------------------------------------------------------------------*/

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  )
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary text-primary-foreground px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchResults
 * -------------------------------------------------------------------------------------------------*/

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) return null

  // Group results by page URL
  const groupedResults = results.reduce(
    (acc, result) => {
      const pageUrl = result.url.split('#')[0]
      if (!acc[pageUrl]) {
        acc[pageUrl] = []
      }
      acc[pageUrl].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>
  )

  return (
    <div className="flex flex-col">
      {Object.entries(groupedResults).map(([pageUrl, pageResults]) => {
        const pageResult = pageResults.find((r) => r.type === 'page')
        const title = pageResult?.content ?? pageResults[0]?.content ?? pageUrl
        const contentPreview = pageResults
          .filter((r) => r.type !== 'page')
          .map((r) => r.content)
          .join(' ')
          .trim()

        return (
          <Link
            key={pageUrl}
            href={pageUrl}
            className={cn(
              'flex flex-col gap-1 px-4 py-2.5 transition-colors',
              'hover:bg-accent'
            )}
          >
            <span className="text-foreground font-mono text-sm font-medium tracking-wide uppercase">
              <HighlightedText text={title} query={query} />
            </span>
            {contentPreview && (
              <span className="text-muted-foreground line-clamp-2 text-xs normal-case">
                <HighlightedText text={contentPreview} query={query} />
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
