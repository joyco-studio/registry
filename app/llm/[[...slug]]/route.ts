import { notFound } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'

import { getLLMText, source } from '@/lib/source'

export const revalidate = false

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  const content = await getLLMText(page)

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
