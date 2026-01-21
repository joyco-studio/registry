import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { trackDownload } from '@/lib/track'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isRegistryPath = pathname.startsWith('/r/')

  if (isRegistryPath) {
    const componentName = pathname.replace(/^\/r\//, '').replace(/\.json$/, '')
    await trackDownload(componentName)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
}
