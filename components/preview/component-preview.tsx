import { getRegistryExampleComponent } from '@/lib/registry-examples'
import { cn } from '@/lib/utils'
import { ComponentSource } from './component-source-code'
import { ResizableIframe } from './resizable-iframe'

interface ComponentPreviewProps extends React.ComponentProps<'div'> {
  name: string
  defaultWidth?: number
  height?: number | string
  resizable?: boolean
}
export function ComponentPreview({
  name,
  className,
  defaultWidth = 800,
  height = 600,
  resizable = false,
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

  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={cn(
        'group not-prose border-border relative overflow-clip rounded-lg border',
        className
      )}
      {...props}
    >
      <div className={cn('preview bg-card relative flex')}>
        <div
          title={undefined}
          className="bg-card border-border my-0 w-full overflow-hidden rounded-none border-b"
        >
          {resizable ? (
            <ResizableIframe
              src={`/view/${name}`}
              defaultWidth={defaultWidth}
              minWidth={280}
              height={height}
            />
          ) : (
            <iframe
              src={`/view/${name}`}
              className="w-full border-0"
              style={{
                height: heightStyle,
              }}
              title={`Preview of ${name} component`}
            />
          )}
        </div>
      </div>
      <ComponentSource name={name} language="tsx" />
    </div>
  )
}
