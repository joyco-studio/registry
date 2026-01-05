'use client'

import { useLayout } from '@/hooks/use-layout'
import { AsideButton } from './nav-aside'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Layout Icons - Visual representation of fixed vs full layout
 * -------------------------------------------------------------------------------------------------*/

function FixedLayoutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-4', className)}
    >
      {/* Centered container with margins */}
      <rect x="6" y="4" width="12" height="16" rx="1" />
      {/* Side indicators */}
      <line x1="3" y1="4" x2="3" y2="20" opacity="0.3" />
      <line x1="21" y1="4" x2="21" y2="20" opacity="0.3" />
    </svg>
  )
}

function FullLayoutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-4', className)}
    >
      {/* Full width container */}
      <rect x="3" y="4" width="18" height="16" rx="1" />
      {/* Expand arrows */}
      <path d="M9 12H4m11 0h5" opacity="0.5" />
      <path d="M7 10l-3 2 3 2" opacity="0.5" />
      <path d="M17 10l3 2-3 2" opacity="0.5" />
    </svg>
  )
}

/* -------------------------------------------------------------------------------------------------
 * LayoutToggle - Toggles between fixed (contained) and full (wide) layout
 * -------------------------------------------------------------------------------------------------*/

export function LayoutToggle() {
  const { layout, setLayout } = useLayout()

  const toggleLayout = () => {
    setLayout((prev) => (prev === 'fixed' ? 'full' : 'fixed'))
  }

  return (
    <AsideButton onClick={toggleLayout} className="max-2xl:hidden">
      {layout === 'fixed' ? (
        <FixedLayoutIcon />
      ) : (
        <FullLayoutIcon />
      )}
      <span className="sr-only">
        {layout === 'fixed' ? 'Switch to full width' : 'Switch to contained width'}
      </span>
    </AsideButton>
  )
}

