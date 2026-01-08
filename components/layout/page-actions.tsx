'use client'

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useCopyToClipboard } from '@/components/copy-button'
import { ArrowUpRight, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        'bg-background inline-flex items-center gap-0.5 rounded-md border px-1.5',
        className
      )}
    >
      {children}
    </kbd>
  )
}

export function PageActions({
  content,
  llmUrl,
  className,
}: {
  content: string
  llmUrl: string | null
  className?: string
}) {
  const { hasCopied, copy } = useCopyToClipboard()

  const cursorUrl = `https://cursor.com/link/prompt?text=${encodeURIComponent(content)}`

  const openInCursor = useCallback(() => {
    window.open(cursorUrl, '_blank')
  }, [cursorUrl])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifier = e.metaKey || e.ctrlKey

      // CMD/Ctrl + U: Copy Markdown
      if (modifier && e.key === 'u') {
        e.preventDefault()
        copy(content)
        return
      }

      // CMD/Ctrl + I: Open in Cursor
      if (modifier && e.key === 'i') {
        e.preventDefault()
        openInCursor()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [content, copy, openInCursor])

  return (
    <div className={cn('not-prose flex items-center gap-1', className)}>
      {/* Copy Markdown - standalone button */}
      <Button
        variant="accent"
        size="sm"
        className="font-mono tracking-wide uppercase"
        onClick={() => copy(content)}
      >
        {hasCopied ? (
          <>
            Copied! <Check className="size-3" />
          </>
        ) : (
          <>
            Copy Markdown <Kbd><span>⌘</span><span>U</span></Kbd>
          </>
        )}
      </Button>

      {/* Dropdown for Open Markdown and Open in Cursor */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="accent"
            size="icon-sm"
            aria-label="More actions"
          >
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {llmUrl && (
            <DropdownMenuItem asChild>
              <Link href={llmUrl} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight className="size-4" />
                Open Markdown
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={openInCursor}>
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.5 20.5L20.5 12L3.5 3.5V10.5L14.5 12L3.5 13.5V20.5Z" />
            </svg>
            Open in Cursor
            <Kbd className="ml-auto text-xs"><span>⌘</span><span>I</span></Kbd>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
