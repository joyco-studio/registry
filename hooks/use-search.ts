'use client'

import * as React from 'react'

export type SearchResult = {
  id: string
  url: string
  type: 'page' | 'heading' | 'text'
  content: string
}

const MIN_QUERY_LENGTH = 2

export function useSearch() {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  // Track which query the current results belong to
  const [resultsForQuery, setResultsForQuery] = React.useState('')

  // Debounced fetch
  React.useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      // Clear results when query is too short
      setResults([])
      setResultsForQuery('')
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      fetch(`/api/search?query=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: SearchResult[]) => {
          // Only update if this is still the current query
          setResults(data)
          setResultsForQuery(query)
        })
        .catch(() => {
          // Ignore aborted requests
        })
    }, 150)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  // Derive display state:
  // - hasResults: we have results TO SHOW for the CURRENT query
  // - isEmpty: we confirmed no results for the CURRENT query
  // - else: idle or loading (show default content)
  const hasResults = resultsForQuery === query && results.length > 0
  const isEmpty = resultsForQuery === query && results.length === 0 && query.length >= MIN_QUERY_LENGTH

  return {
    query,
    setQuery,
    results,
    hasResults,
    isEmpty,
  }
}
