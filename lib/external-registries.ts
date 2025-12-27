import { source } from '@/lib/source'

export interface ExternalComponent {
  slug: string
  title: string
  description: string
  registry: string
  externalUrl: string
  /**
   * Full URL to the component's registry JSON file.
   * This enables installation via your registry domain:
   * `npx shadcn@latest add https://registry.joyco.studio/r/{slug}.json`
   * which redirects to this URL.
   */
  externalRegistryUrl: string
}

/**
 * Get all external component redirects for Next.js config
 * Redirects /r/{slug}.json to the external registry's JSON file
 */
export function getExternalComponentRedirects() {
  return source
    .getPages()
    .filter((page) => page.data.externalRegistry?.registryUrl)
    .map((page) => ({
      source: `/r/${page.slugs.at(-1)}.json`,
      destination: page.data.externalRegistry!.registryUrl,
      permanent: false,
    }))
}

export function getExternalComponentBySlug(
  slug: string
): ExternalComponent | undefined {
  const page = source
    .getPages()
    .find((p) => p.slugs.at(-1) === slug && p.data.externalRegistry)

  if (!page?.data.externalRegistry) return undefined

  return {
    slug,
    title: page.data.title,
    description: page.data.description ?? '',
    externalUrl: page.data.externalRegistry.url,
    externalRegistryUrl: page.data.externalRegistry.registryUrl,
    registry: page.data.externalRegistry.name,
  }
}
