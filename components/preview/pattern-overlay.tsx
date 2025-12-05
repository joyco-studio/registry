import * as React from 'react'

export function PatternOverlay({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={
        {
          '--pattern-fg': 'color-mix(in oklab, var(--border) 30%, transparent)',
          backgroundImage:
            'repeating-linear-gradient(315deg,var(--pattern-fg) 0,var(--pattern-fg) 1px,transparent 0,transparent 50%)',
          backgroundAttachment: 'fixed',
          backgroundSize: '10px 10px',
        } as React.CSSProperties
      }
    />
  )
}
