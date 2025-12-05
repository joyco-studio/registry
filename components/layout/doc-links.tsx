import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DocLink {
  label: string
  href: string
}

export function DocLinks({
  links,
  className,
}: {
  links: DocLink[]
  className?: string
}) {
  if (links.length === 0) return null

  return (
    <div
      className={cn('not-prose my-0 flex flex-wrap gap-x-2 gap-y-1', className)}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium',
            'text-foreground transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          )}
        >
          {link.label}
          <ArrowUpRight className="size-3.5" />
        </a>
      ))}
    </div>
  )
}
