import { getRegistryExampleComponent } from '@/lib/registry-examples'
import { cn } from '@/lib/utils'
import { ComponentSource } from './component-source-code'
import { Card } from 'fumadocs-ui/components/card'
import { ResizableIframe } from '../resizable-iframe'
import { PatternOverlay } from './pattern-overlay'

interface ComponentPreviewProps extends React.ComponentProps<'div'> {
  name: string
  defaultWidth?: number
  height?: number | string
}
export function ComponentPreview({
  name,
  className,
  defaultWidth = 800,
  height = 600,
  ...props
}: ComponentPreviewProps) {
  const Component = getRegistryExampleComponent(name)

  if (!Component) {
    return (
      <p className="text-muted-foreground mt-6 text-sm">
        Component{' '}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{' '}
        not found in registry.
      </p>
    )
  }

  return (
    <div
      className={cn(
        'group not-prose relative overflow-clip rounded-lg',
        className
      )}
      {...props}
    >
      <div className={cn('preview bg-card relative flex px-4 py-10')}>
        <PatternOverlay className="bg-card pointer-events-none absolute inset-0" />
        <div
          title={undefined}
          className="bg-card border-border my-0 w-full overflow-hidden rounded-none"
        >
          <ResizableIframe
            src={`/view/${name}`}
            defaultWidth={defaultWidth}
            minWidth={280}
            height={height}
          />
        </div>
      </div>
      <ComponentSource name={name} language="tsx" />
    </div>
  )
}
