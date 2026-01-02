'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Theme configuration
 * -------------------------------------------------------------------------------------------------*/

type ThemeConfig = {
  name: string
  label: string
}

const themes: ThemeConfig[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
  { name: 'radio', label: 'Radio' },
]

/* -------------------------------------------------------------------------------------------------
 * ThemePreview - Shows a visual representation of theme colors
 * -------------------------------------------------------------------------------------------------*/

type ThemePreviewProps = {
  themeClass?: string
  className?: string
}

export const ThemePreview = ({ themeClass, className }: ThemePreviewProps) => (
  <div
    className={cn('flex flex-col items-center gap-px', themeClass, className)}
  >
    <div className="bg-primary ring-border/5 size-3 rounded-full ring" />
    <div className="flex gap-px">
      <div className="bg-foreground ring-border/5 size-3 rounded-full ring" />
      <div className="bg-background ring-border/5 size-3 rounded-full ring" />
    </div>
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * ThemeToggle - Opens/closes a menu of available themes
 * -------------------------------------------------------------------------------------------------*/

export const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => setMounted(true), [])

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (!mounted) {
    return (
      <Button
        variant="muted"
        size="icon"
        className="bg-muted size-aside-width"
        disabled
      />
    )
  }

  const currentTheme = themes.find((t) => t.name === theme) ?? themes[0]

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      {/* Theme options - shown when open */}
      {isOpen && (
        <div className="flex flex-col gap-1">
          {themes
            .filter((t) => t.name !== theme)
            .map((t) => (
              <Button
                key={t.name}
                variant="muted"
                size="icon"
                className="bg-muted size-aside-width hover:brightness-95"
                onClick={() => {
                  setTheme(t.name)
                  setIsOpen(false)
                }}
              >
                <ThemePreview themeClass={t.name} />
                <span className="sr-only">{t.label}</span>
              </Button>
            ))}
        </div>
      )}

      {/* Current theme toggle button */}
      <Button
        variant="muted"
        size="icon"
        className="bg-muted size-aside-width hover:brightness-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="font-mono text-xs uppercase">Close</span>
        ) : (
          <ThemePreview themeClass={currentTheme.name} />
        )}
        {!isOpen && <span className="sr-only">{currentTheme.label}</span>}
      </Button>
    </div>
  )
}
