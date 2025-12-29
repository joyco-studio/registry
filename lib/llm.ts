import fs from 'fs'
import path from 'path'

/**
 * Gets the language identifier from a file extension
 */
function getLanguageFromExtension(ext: string): string {
  const extensionMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    sh: 'bash',
    bash: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
  }
  return extensionMap[ext] || ext
}

/**
 * Strips frontmatter from content (for guideline files)
 */
function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n*/m, '')
}

/**
 * Processes MDX content for LLM consumption by:
 * 1. Removing frontmatter (already handled by title in getLLMText)
 * 2. Removing import statements
 * 3. Replacing ComponentPreview components with their actual source code
 * 4. Replacing FileCodeblock components with their file content
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

  // Match <FileCodeblock filePath="..." /> or <FileCodeblock filePath="..."></FileCodeblock>
  const fileCodeblockRegex =
    /<FileCodeblock[\s\S]*?filePath="([^"]+)"[\s\S]*?(?:\/>|<\/FileCodeblock>)/g

  processed = processed.replace(fileCodeblockRegex, (match, filePath) => {
    try {
      const fullPath = path.join(process.cwd(), filePath)

      if (!fs.existsSync(fullPath)) {
        console.warn(`File not found: ${fullPath}`)
        return match
      }

      let source = fs.readFileSync(fullPath, 'utf8')

      // Strip frontmatter from guideline files
      if (filePath.includes('/public/guidelines')) {
        source = stripFrontmatter(source)
      }

      // Determine language from file extension
      const ext = path.extname(filePath).slice(1)
      const lang = getLanguageFromExtension(ext)

      return `\`\`\`${lang}
${source}
\`\`\``
    } catch (error) {
      console.error(`Error processing FileCodeblock ${filePath}:`, error)
      return match
    }
  })

  return processed.trim()
}
