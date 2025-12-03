'use client'
import * as React from 'react'
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComponentCode({
  highlightedCode,
  language,
  title,
}: {
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  const needsExpand = React.useMemo(() => {
    // count lines
    const lines = highlightedCode.split('\n').length
    return lines > 10
  }, [highlightedCode])

  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <figure
      data-rehype-pretty-code-figure=""
      className="group/code my-0 rounded-none bg-linear-to-br shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:shadow-black/20 dark:hover:shadow-black/30"
    >
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground bg-card flex"
          data-language={language}
        >
          <span className="font-medium">{title}</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <span className="font-mono text-xs opacity-60">{language}</span>
          </div>
        </figcaption>
      )}

      {/* Code container with scrollbar */}
      <div
        className={cn(
          'scrollbar-none bg-card [&>pre]:rounded-none [&>pre]:bg-transparent',
          '[&>pre]:scrollbar-none [&>pre]:max-h-96 [&>pre]:overflow-x-auto [&>pre]:p-4',
          isExpanded ? 'max-h-none' : 'max-h-96'
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </div>
      {needsExpand && (
        <>
          <div className="from-card to-card/0 absolute right-0 bottom-0 h-12 w-full bg-linear-to-t" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1/2 bottom-0 -translate-x-1/2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={cn('h-4 w-4', isExpanded ? 'rotate-180' : '')}
            />
          </Button>
        </>
      )}
    </figure>
  )
}
