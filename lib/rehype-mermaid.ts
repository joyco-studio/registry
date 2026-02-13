import type { Root, Element, ElementContent } from 'hast'
import {
  createMermaidRenderer,
  type MermaidRenderer,
} from 'mermaid-isomorphic'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { toText } from 'hast-util-to-text'
import { visitParents } from 'unist-util-visit-parents'
import type { VFile } from 'vfile'

let renderer: MermaidRenderer | undefined

/**
 * Rehype plugin that renders Mermaid diagrams at build time with dual-theme support.
 * Generates both light and dark SVGs and uses CSS class-based toggling
 * compatible with next-themes.
 */
export default function rehypeMermaidDualTheme() {
  return async (tree: Root, file: VFile) => {
    type DiagramInstance = {
      preElement: Element
      preParent: Element | Root
      diagram: string
    }

    const instances: DiagramInstance[] = []

    visitParents(tree, 'element', (node, ancestors) => {
      const element = node as Element

      // Match <code class="language-mermaid"> inside <pre>
      if (element.tagName !== 'code') return
      const className = element.properties?.className
      if (!Array.isArray(className)) return
      if (!className.includes('language-mermaid')) return

      const pre = ancestors.at(-1)
      if (
        !pre ||
        pre.type !== 'element' ||
        (pre as Element).tagName !== 'pre'
      )
        return

      const preParent = ancestors.at(-2)
      if (!preParent || !('children' in preParent)) return

      const text = toText(element, { whitespace: 'pre' })
      if (!text.trim()) return

      instances.push({
        preElement: pre as Element,
        preParent: preParent as Element | Root,
        diagram: text,
      })
    })

    if (instances.length === 0) return

    if (!renderer) {
      renderer = createMermaidRenderer()
    }

    const diagrams = instances.map((i) => i.diagram)

    // Render both light and dark versions in parallel
    const [lightResults, darkResults] = await Promise.all([
      renderer(diagrams, {
        mermaidConfig: { theme: 'default' },
        prefix: 'mermaid-light',
      }),
      renderer(diagrams, {
        mermaidConfig: { theme: 'dark' },
        prefix: 'mermaid-dark',
      }),
    ])

    // Process in reverse order to preserve indices when replacing
    for (let i = instances.length - 1; i >= 0; i--) {
      const { preElement, preParent } = instances[i]
      const lightResult = lightResults[i]
      const darkResult = darkResults[i]

      if (
        lightResult.status !== 'fulfilled' ||
        darkResult.status !== 'fulfilled'
      ) {
        const error =
          lightResult.status === 'rejected'
            ? lightResult.reason
            : darkResult.status === 'rejected'
              ? darkResult.reason
              : new Error('Unknown render error')
        file.message(`Failed to render mermaid diagram: ${error.message}`)
        continue
      }

      const lightSvg = fromHtmlIsomorphic(lightResult.value.svg, {
        fragment: true,
      }).children[0] as ElementContent
      const darkSvg = fromHtmlIsomorphic(darkResult.value.svg, {
        fragment: true,
      }).children[0] as ElementContent

      // Wrap in themed containers:
      // - [data-mermaid-theme="light"] is shown by default, hidden when .dark or .terminal
      // - [data-mermaid-theme="dark"] is hidden by default, shown when .dark or .terminal
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['mermaid-diagram'],
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { 'data-mermaid-theme': 'light' },
            children: [lightSvg],
          } as Element,
          {
            type: 'element',
            tagName: 'div',
            properties: { 'data-mermaid-theme': 'dark' },
            children: [darkSvg],
          } as Element,
        ],
      }

      const preIndex = (
        preParent.children as ElementContent[]
      ).indexOf(preElement as unknown as ElementContent)
      if (preIndex === -1) continue

      preParent.children[preIndex] = wrapper
    }
  }
}
