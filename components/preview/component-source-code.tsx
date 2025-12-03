import * as React from 'react'
import { BundledLanguage, codeToHtml } from 'shiki'
import { getRegistryExampleComponentFile } from '@/lib/registry-examples'
import { ComponentCode } from './component-code'

export async function ComponentSource({
  name,
  title,
  language = 'tsx',
}: React.ComponentProps<'div'> & {
  name?: string

  title?: string
  language: BundledLanguage
}) {
  if (!name) {
    return null
  }

  let code: string | undefined

  // from the name we should remove all from <name><-demo...>.<file-extension>
  // we should remove all from -demo

  if (name) {
    const files = await getRegistryExampleComponentFile(name)
    code = files?.[0]?.content
  }

  if (!code) {
    return null
  }

  // Replace export default with export.
  code = code.replaceAll('export default', 'export')
  code = code.replaceAll('/* eslint-disable react/no-children-prop */\n', '')

  const highlightedCode = await codeToHtml(code, {
    lang: language,
    defaultColor: 'light-dark()',
    themes: {
      dark: 'github-dark',
      light: 'github-light-default',
    },
  })

  return (
    <ComponentCode
      highlightedCode={highlightedCode}
      language={language}
      title={title}
    />
  )
}
