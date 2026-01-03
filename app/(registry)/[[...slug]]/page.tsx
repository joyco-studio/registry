import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createRelativeLink } from 'fumadocs-ui/mdx'

import { getPageImage, getLLMText, source } from '@/lib/source'
import { getDownloadStats } from '@/lib/stats'
import { getMDXComponents } from '@/mdx-components'
import { Maintainers } from '@/components/layout/maintainers'
import { WeeklyDownloads } from '@/components/layout/weekly-downloads'
import { TOC } from '@/components/layout/toc'
import { InferPageType } from 'fumadocs-core/source'
import { DocLinks } from '@/components/layout/doc-links'
import { PageActions } from '@/components/layout/page-actions'

const getComponentSlug = (page: InferPageType<typeof source>) => {
  if (page.slugs[0] !== 'components') return undefined
  return page.slugs[page.slugs.length - 1]
}

export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body

  const componentSlug = getComponentSlug(page)
  const downloadStats = componentSlug
    ? await getDownloadStats(componentSlug)
    : null
  const docLinks = page.data.docLinks
  const llmText = await getLLMText(page)
  const llmUrl = `/${page.slugs.join('/')}.md`

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        enabled: true,
        component: (
          <TOC
            footer={
              <>
                <Maintainers
                  maintainers={page.data.maintainers}
                  lastModified={
                    page.data.lastModified
                      ? new Date(page.data.lastModified)
                      : undefined
                  }
                />
                {downloadStats && <WeeklyDownloads data={downloadStats} />}
              </>
            }
          />
        ),
      }}
    >
      <div className="mx-auto max-w-2xl 2xl:max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <DocsTitle className="leading-tight">{page.data.title}</DocsTitle>
          <PageActions
            className="max-sm:hidden"
            content={llmText}
            llmUrl={llmUrl}
          />
        </div>
        <DocsDescription className="mb-1">
          {page.data.description}
        </DocsDescription>
        <div className="mb-4 flex items-center justify-between gap-8">
          <DocLinks links={docLinks} />
          <PageActions
            className="sm:hidden"
            content={llmText}
            llmUrl={llmUrl}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </div>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(
  props: PageProps<'/[[...slug]]'>
): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  }
}
