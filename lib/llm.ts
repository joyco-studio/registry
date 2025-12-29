import fs from 'fs'
import path from 'path'

/**
 * Processes MDX content for LLM consumption by:
 * 1. Removing frontmatter (already handled by title in getLLMText)
 * 2. Removing import statements
 * 3. Replacing ComponentPreview components with their actual source code
 */
export function processMdxForLLMs(content: string): string {
  let processed = content

  // Remove frontmatter (--- ... ---)
  processed = processed.replace(/^---[\s\S]*?---\n*/m, '')

  // Remove import statements
  processed = processed.replace(/^import\s+.*$/gm, '')

  // Clean up multiple consecutive newlines (max 2)
  processed = processed.replace(/\n{3,}/g, '\n\n')

  // Match <ComponentPreview name="..." /> or <ComponentPreview name="..."></ComponentPreview>
  const componentPreviewRegex =
    /<ComponentPreview[\s\S]*?name="([^"]+)"[\s\S]*?(?:\/>|<\/ComponentPreview>)/g

  processed = processed.replace(componentPreviewRegex, (match, name) => {
    try {
      // Demo files are in the /demos directory
      const demoPath = path.join(process.cwd(), 'demos', `${name}.tsx`)

      if (!fs.existsSync(demoPath)) {
        console.warn(`Demo file not found: ${demoPath}`)
        return match
      }

      const source = fs.readFileSync(demoPath, 'utf8')

      return `\`\`\`tsx
${source}
\`\`\``
    } catch (error) {
      console.error(`Error processing ComponentPreview ${name}:`, error)
      return match
    }
  })

  return processed.trim()
}
