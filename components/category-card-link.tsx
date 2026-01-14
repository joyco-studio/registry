import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

function CategoryCardLink({
  className,
  href,
  children,
  ...props
}: Omit<React.ComponentProps<'a'>, 'href'> & { href: string }) {
  return (
    <Link
      data-slot="category-card-link"
      href={href}
      className={cn(
        'group/category-card not-prose text-card-foreground hocus:border-accent flex flex-col gap-1 overflow-hidden rounded-lg transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

function CategoryCardLinkHeader({
  className,
  label,
  icon,
  count,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  label: React.ReactNode
  icon: React.ReactNode
  count?: number
}) {
  return (
    <div
      data-slot="category-card-header"
      className={cn('flex items-center gap-x-1', className)}
      {...props}
    >
      <span
        data-slot="icon"
        className="bg-card group-hocus/category-card:bg-accent text-accent-foreground flex size-10 shrink-0 items-center justify-center rounded-md transition-colors [&>svg]:size-5"
      >
        {icon}
      </span>
      <div className="group-hocus/category-card:bg-accent transition-colors bg-card flex h-full flex-1 items-center px-3">
        <span
          data-slot="label"
          className="flex-1 font-mono font-medium uppercase"
        >
          {label}
        </span>
        {count !== undefined && (
          <span
            data-slot="count"
            className="text-accent-foreground bg-accent min-w-[2ch] px-1 py-0.5 text-sm tabular-nums"
          >
            {count}
          </span>
        )}
      </div>
    </div>
  )
}

function CategoryCardLinkSplash({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="category-card-splash"
      className={cn(
        'bg-muted transition-colors group-hocus/category-card:bg-accent aspect-268/208 w-full overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { CategoryCardLink, CategoryCardLinkHeader, CategoryCardLinkSplash }
