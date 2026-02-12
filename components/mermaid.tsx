'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
})

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        el.innerHTML = svg
      })
      .catch(console.error)
  }, [chart])

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center [&_svg]:max-w-full"
    />
  )
}
