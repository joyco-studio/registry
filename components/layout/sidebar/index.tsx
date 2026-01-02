'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import type * as PageTree from 'fumadocs-core/page-tree'
import { useDocsSearch } from 'fumadocs-core/search/client'

import { SidebarSearch } from './search'
import { SearchResults, type SearchResult } from './search-results'
import { NoResults } from './no-results'
import { SidebarSection, type SidebarItemMeta } from './section'
import { SocialLinks } from './social-links'

export type { SidebarItemMeta }

type RegistrySidebarProps = {
  tree: PageTree.Root
  /**
   * Optional metadata for items (badges, dots, etc.)
   * Key is the page URL, e.g. "/components/scroll-area"
   */
  itemMeta?: Record<string, SidebarItemMeta>
}

const MIN_QUERY_LENGTH = 2

export function RegistrySidebar({ tree, itemMeta = {} }: RegistrySidebarProps) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState('')
  const [displayedResults, setDisplayedResults] = React.useState<
    SearchResult[]
  >([])
  const [noResults, setNoResults] = React.useState(false)

  // Use fumadocs search
  const { setSearch, query: searchQuery } = useDocsSearch({
    type: 'fetch',
  })

  // Sync query to fumadocs search (only when min length met)
  React.useEffect(() => {
    if (query.length >= MIN_QUERY_LENGTH) {
      setSearch(query)
    } else {
      // Clear everything when query is too short
      setDisplayedResults([])
      setNoResults(false)
    }
  }, [query, setSearch])

  // Update displayed results only when new data arrives
  React.useEffect(() => {
    const data = searchQuery.data as unknown
    if (!data || query.length < MIN_QUERY_LENGTH) {
      return
    }

    let results: SearchResult[] = []
    if (Array.isArray(data)) {
      results = data as SearchResult[]
    } else if (typeof data === 'object' && data !== null && 'results' in data) {
      const obj = data as { results: unknown }
      if (Array.isArray(obj.results)) {
        results = obj.results as SearchResult[]
      }
    }

    // Update results - keep previous results visible until new ones arrive
    setDisplayedResults(results)
    setNoResults(results.length === 0)
  }, [searchQuery.data, query])

  // Determine what to show
  const isSearching = query.length >= MIN_QUERY_LENGTH
  const hasResults = displayedResults.length > 0

  // Get all folders from the tree
  const folders = tree.children.filter(
    (child): child is PageTree.Folder => child.type === 'folder'
  )

  // Render content based on state
  const renderContent = () => {
    if (isSearching && hasResults) {
      return <SearchResults results={displayedResults} query={query} />
    }
    if (isSearching && noResults) {
      return <NoResults query={query} />
    }
    // Show folders when not searching
    return folders.map((folder, index) => {
      const folderName =
        typeof folder.name === 'string' ? folder.name : String(folder.name)
      const sectionId =
        folder.$id?.split(':')[1]?.toLowerCase() ?? folderName.toLowerCase()
      const isCurrentSection = pathname.startsWith(`/${sectionId}`)

      return (
        <SidebarSection
          key={folder.$id ?? index}
          folder={folder}
          defaultOpen={isCurrentSection || index === 0}
          meta={itemMeta}
        />
      )
    })
  }

  return (
    <div className="registry-sidebar flex h-full w-full flex-col gap-1 text-sm">
      <SidebarSearch query={query} setQuery={setQuery} />

      <nav className="bg-accent/70 fancy-scroll overflow-y-auto">
        {renderContent()}
      </nav>

      <div className="bg-muted flex-1" />

      <SocialLinks />
    </div>
  )
}
