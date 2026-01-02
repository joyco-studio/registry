'use client'

import { sitemap, SitemapItem } from '@/lib/sitemap'
import Link from 'next/link'
import React from 'react'
import { Logo } from '../logos'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export const NavAside = () => {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 flex h-screen flex-col gap-1 self-start max-md:hidden">
      <div className="size-aside-width bg-primary text-primary-foreground flex items-center justify-center">
        <Logo />
      </div>
      {sitemap.map((item) => (
        <NavAsideItem
          key={item.href}
          item={item}
          active={pathname.startsWith(item.href)}
        />
      ))}
      <div className="bg-muted flex-1" />
    </div>
  )
}

const NavAsideItem = ({
  item,
  active,
}: {
  item: SitemapItem
  active: boolean
}) => {
  return (
    <Link
      href={item.href}
      className={cn(
        'bg-muted flex items-center justify-center gap-2 font-mono font-medium tracking-wide uppercase',
        active
          ? 'w-aside-width bg-accent text-accent-foreground rotate-180 px-6 [writing-mode:vertical-rl]'
          : 'size-aside-width hover:brightness-95'
      )}
    >
      <item.icon className="size-5" />
      <span className={cn('text-sm 2xl:text-base', active ? '' : 'sr-only')}>
        {item.label}
      </span>
    </Link>
  )
}
