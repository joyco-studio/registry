'use client'

import { SnakeGame } from './snake-game'

type NoResultsProps = {
  query: string
}

export function NoResults({ query }: NoResultsProps) {
  return (
    <>
      <div className="bg-accent py-4 text-center">
        <p className="text-muted-foreground font-mono text-sm font-medium uppercase">
          No results for &ldquo;
          <span className="text-foreground font-bold">{query}</span>&rdquo;
        </p>
        <p className="text-muted-foreground/60 mt-1 text-xs">
          While you&apos;re here...
        </p>
      </div>
      <SnakeGame />
    </>
  )
}
