'use client'

import * as React from 'react'
import type { JSONContent } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import Mention from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'

import { cn } from '@/lib/utils'
import type { RichTextareaFeature } from './rich-textarea'

const MENTION_TOKEN_REGEX = /@\{([^|}]+)\|([^}]+)\}/g

export type MentionItem = {
  id: string
  label: string
  avatarUrl?: string
  subtitle?: string
}

export type MentionMenuHandle = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export type MentionMenuProps = {
  items: MentionItem[]
  command: (item: MentionItem) => void
}

export type MentionFeatureConfig = {
  getItems: (query: string) => Promise<MentionItem[]> | MentionItem[]
  MenuComponent: React.ForwardRefExoticComponent<
    MentionMenuProps & React.RefAttributes<MentionMenuHandle>
  >
}

type MentionFeatureState = {
  isOpen: boolean
  onKeyDown: ((props: { event: KeyboardEvent }) => boolean) | null
}

export const DefaultMentionMenu = React.forwardRef<
  MentionMenuHandle,
  MentionMenuProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const selectItem = React.useCallback(
    (index: number) => {
      const item = items[index]
      if (!item) return
      command(item)
    },
    [items, command]
  )

  React.useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setSelectedIndex((index) =>
            items.length === 0 ? 0 : (index - 1 + items.length) % items.length
          )
          return true
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          setSelectedIndex((index) =>
            items.length === 0 ? 0 : (index + 1) % items.length
          )
          return true
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          selectItem(selectedIndex)
          return true
        }
        return false
      },
    }),
    [items.length, selectItem, selectedIndex]
  )

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground px-3 py-2 text-sm">
        No results
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden',
            index === selectedIndex
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-muted'
          )}
          onMouseDown={(event) => {
            event.preventDefault()
            selectItem(index)
          }}
          aria-selected={index === selectedIndex}
          data-highlighted={index === selectedIndex ? '' : undefined}
          role="option"
        >
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt=""
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <span className="bg-muted text-muted-foreground flex size-6 items-center justify-center rounded-full text-xs font-semibold">
              {item.label.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{item.label}</div>
            {item.subtitle ? (
              <div className="text-muted-foreground truncate text-xs">
                {item.subtitle}
              </div>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  )
})

DefaultMentionMenu.displayName = 'DefaultMentionMenu'

function serializeWithMentions(
  node: ProseMirrorNode,
  base: (doc: ProseMirrorNode) => string
): string {
  if (node.type.name === 'doc') {
    let output = ''
    node.forEach((child, _, index) => {
      if (index > 0) output += '\n'
      output += serializeWithMentions(child, base)
    })
    return output
  }

  if (node.type.name === 'paragraph') {
    let output = ''
    node.forEach((child) => {
      output += serializeWithMentions(child, base)
    })
    return output
  }

  if (node.type.name === 'hardBreak') {
    return '\n'
  }

  if (node.type.name === 'mention') {
    const id = node.attrs?.id ?? ''
    const label = node.attrs?.label ?? ''
    return `@{${id}|${label}}`
  }

  return base(node)
}

function parseWithMentions(value: string): JSONContent {
  const content: JSONContent[] = []
  let lastIndex = 0
  MENTION_TOKEN_REGEX.lastIndex = 0
  let match = MENTION_TOKEN_REGEX.exec(value)

  const pushTextWithBreaks = (text: string) => {
    const parts = text.split('\n')
    parts.forEach((part, index) => {
      if (part) {
        content.push({ type: 'text', text: part })
      }
      if (index < parts.length - 1) {
        content.push({ type: 'hardBreak' })
      }
    })
  }

  while (match) {
    const [token, id, label] = match
    const before = value.slice(lastIndex, match.index)
    pushTextWithBreaks(before)

    content.push({
      type: 'mention',
      attrs: {
        id,
        label,
      },
    })

    lastIndex = match.index + token.length
    match = MENTION_TOKEN_REGEX.exec(value)
  }

  const rest = value.slice(lastIndex)
  pushTextWithBreaks(rest)

  return {
    type: 'doc',
    content: [
      content.length > 0
        ? { type: 'paragraph', content }
        : { type: 'paragraph' },
    ],
  }
}

function createMentionSuggestion(
  config: MentionFeatureConfig,
  stateRef: React.MutableRefObject<MentionFeatureState>
) {
  return {
    char: '@',
    startOfLine: false,
    items: ({ query }: { query: string }) =>
      /^[\w-]*$/.test(query) ? config.getItems(query) : [],
    allow: ({ range, state }: { range: { from: number }; state: any }) => {
      if (range.from <= 1) return true
      const previousChar = state.doc.textBetween(range.from - 1, range.from)
      return /\s/.test(previousChar)
    },
    render: () => {
      let renderer: ReactRenderer | null = null
      let container: HTMLDivElement | null = null

      const setPosition = (clientRect?: () => DOMRect | null) => {
        const rect = clientRect?.()
        if (!rect || !container) return

        const offset = 8
        container.style.left = `${rect.left}px`
        container.style.top = `${rect.bottom + offset}px`
      }

      const handleKeyDown = ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'Escape') {
          stateRef.current.isOpen = false
          stateRef.current.onKeyDown = null
          if (container) {
            container.style.display = 'none'
          }
          return true
        }
        const handler = renderer?.ref as MentionMenuHandle | undefined
        return handler?.onKeyDown({ event }) ?? false
      }

      return {
        onStart: (props: any) => {
          stateRef.current.isOpen = true
          stateRef.current.onKeyDown = handleKeyDown

          renderer = new ReactRenderer(config.MenuComponent, {
            props: {
              items: props.items,
              command: props.command,
            },
            editor: props.editor,
          })

          container = document.createElement('div')
          container.className =
            'text-popover-foreground border-border shadow-md z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1'
          container.style.position = 'fixed'

          document.body.appendChild(container)
          container.appendChild(renderer.element)

          setPosition(props.clientRect)
        },
        onUpdate: (props: any) => {
          stateRef.current.isOpen = true
          stateRef.current.onKeyDown = handleKeyDown
          renderer?.updateProps({
            items: props.items,
            command: props.command,
          })
          if (container) container.style.display = 'block'
          setPosition(props.clientRect)
        },
        onKeyDown: (props: { event: KeyboardEvent }) => handleKeyDown(props),
        onExit: () => {
          stateRef.current.isOpen = false
          stateRef.current.onKeyDown = null
          renderer?.destroy()
          renderer = null
          container?.remove()
          container = null
        },
      }
    },
  }
}

export function useMentionsFeature(
  config: MentionFeatureConfig
): RichTextareaFeature {
  const stateRef = React.useRef<MentionFeatureState>({
    isOpen: false,
    onKeyDown: null,
  })

  const suggestion = React.useMemo(
    () => createMentionSuggestion(config, stateRef),
    [config]
  )

  const mentionExtension = React.useMemo(
    () =>
      Mention.configure({
        HTMLAttributes: {
          class:
            'rounded bg-blue-200 py-px text-blue-950 dark:bg-blue-800 dark:text-blue-50',
          'data-mention': '',
          'data-tag': '',
        },
        renderLabel({ node }) {
          const label = node.attrs.label ?? node.attrs.id ?? ''
          return `@${label}`
        },
        suggestion,
      }),
    [suggestion]
  )

  return React.useMemo(
    () => ({
      extensions: [mentionExtension],
      keyHandler: ({ event }) =>
        stateRef.current.isOpen
          ? (stateRef.current.onKeyDown?.({ event }) ?? false)
          : false,
      serialize: (doc, base) => serializeWithMentions(doc, base),
      parse: (value) => parseWithMentions(value),
    }),
    [mentionExtension]
  )
}
