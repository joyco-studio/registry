import './styles/globals.css'
import { Metadata } from 'next'
import { Public_Sans, Roboto_Mono } from 'next/font/google'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { Analytics } from '@vercel/analytics/next'
import { cn } from '@/lib/utils'

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: {
    template: '%s | JOYCO Registry',
    default: 'JOYCO Registry',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        href: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '32x32',
      },
      {
        url: '/icon.png',
        href: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
  },
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(publicSans.className, robotoMono.className)}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-1 flex-col">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  )
}
