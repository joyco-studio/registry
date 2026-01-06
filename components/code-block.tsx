'use client'

import { CopyButton } from '@/components/copy-button'
import { cn } from '@/lib/utils'

export function CodeBlock({
  highlightedCode,
  language,
  title,
  rawCode,
  maxHeight,
}: {
  highlightedCode: string
  language: string
  title: string | undefined
  rawCode?: string
  maxHeight?: number
}) {
  return (
    <figure
      className={cn(
        'not-prose group/code relative mt-6 overflow-hidden text-sm outline-none',
        title && '*:data-[slot=copy-button]:top-2'
      )}
      data-slot="code-block"
    >
      {title && (
        <figcaption
          className="text-muted-foreground/50 overflow-hidden px-4 py-2.5 pr-40 font-mono text-sm leading-relaxed text-ellipsis whitespace-nowrap"
          data-language={language}
        >
          <span>{title}</span>
        </figcaption>
      )}
      {rawCode && (
        <CopyButton forceVisible={!!title} value={rawCode} className="size-9" />
      )}

      <div
        style={
          {
            '--pre-max-height': maxHeight ? `${maxHeight}px` : 'unset',
          } as React.CSSProperties
        }
        className="bg-muted [&>pre]:text-code-foreground [&>pre]:max-h-(--pre-max-height) [&>pre]:overflow-x-auto [&>pre]:text-sm"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </figure>
  )
}
