'use client'

import * as React from 'react'

import { CopyButton } from '@/components/copy-button'
import { useConfig } from '@/hooks/use-config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: React.ComponentProps<'pre'> & {
  __npm__?: string
  __yarn__?: string
  __pnpm__?: string
  __bun__?: string
}) {
  const [config, setConfig] = useConfig()

  const packageManager = config.packageManager || 'pnpm'
  const tabs = React.useMemo(() => {
    return {
      pnpm: __pnpm__,
      npm: __npm__,
      yarn: __yarn__,
      bun: __bun__,
    }
  }, [__npm__, __pnpm__, __yarn__, __bun__])

  const command = tabs[packageManager]

  return (
    <div
      data-slot="command-block"
      className="not-prose relative flex flex-col overflow-hidden"
    >
      <Tabs
        value={packageManager}
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as 'pnpm' | 'npm' | 'yarn' | 'bun',
          })
        }}
      >
        {/* Header row with tabs and copy button */}
        <div className="bg-background border-background flex gap-1 border-b-4">
          <TabsList className="bg-transparent">
            {Object.entries(tabs).map(([key]) => (
              <TabsTrigger key={key} value={key}>
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Flex filler */}
          <div className="bg-muted flex-1 self-stretch" />
          {/* Copy button */}
          {command && (
            <CopyButton
              value={command}
              variant="ghost"
              absolute={false}
              forceVisible
              className="bg-muted size-9"
            />
          )}
        </div>

        {/* Command content */}
        <div className="bg-accent no-scrollbar overflow-x-auto">
          {Object.entries(tabs).map(([key, value]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <pre className="m-0">
                <code
                  className="text-accent-foreground block px-4 py-3 font-mono text-sm"
                  data-language="bash"
                >
                  {value}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
