'use client'

import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageActions({
  content,
  llmUrl,
  className,
}: {
  content: string
  llmUrl: string
  className?: string
}) {
  return (
    <div className={cn('not-prose flex items-center gap-1', className)}>
      <CopyButton
        value={content}
        variant="muted"
        size="sm"
        className="h-auto px-3 py-2 font-mono text-xs uppercase tracking-wide"
      >
        {(hasCopied) => (
          <>
            {hasCopied ? 'Copied!' : 'Copy Markdown'}
            <ArrowUpRight className="size-3" />
          </>
        )}
      </CopyButton>
      <Link
        href={llmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-muted text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground inline-flex h-auto items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors"
      >
        Open in Cursor
        <ArrowUpRight className="size-3" />
      </Link>
    </div>
  )
}
