'use client'

import * as React from 'react'

import { RichTextarea } from '@/registry/joyco/blocks/rich-textarea'
import {
  DefaultMentionMenu,
  useMentionsFeature,
} from '@/registry/joyco/blocks/rich-textarea-mentions'

const PEOPLE = [
  {
    id: 'u_01',
    label: 'Matias',
    subtitle: 'Design + DX',
    avatarUrl: '/static/c/matiasperz.webp',
  },
  {
    id: 'u_02',
    label: 'Joyboy',
    subtitle: 'Product',
    avatarUrl: '/static/c/joyboy.webp',
  },
  {
    id: 'u_03',
    label: 'Fabroos',
    subtitle: 'Engineering',
    avatarUrl: '/static/c/fabroos.webp',
  },
  {
    id: 'u_04',
    label: 'Joyco',
    subtitle: 'Studio',
    avatarUrl: '/static/c/joyco.webp',
  },
]

export default function RichTextareaMentionsDemo() {
  const [value, setValue] = React.useState('')
  const [messages, setMessages] = React.useState<string[]>([])
  const valueRef = React.useRef(value)
  const getItems = React.useCallback((query: string) => {
    const normalized = query.toLowerCase()
    return PEOPLE.filter((person) =>
      person.label.toLowerCase().includes(normalized)
    )
  }, [])
  const mentionFeature = useMentionsFeature(
    React.useMemo(
      () => ({
        getItems,
        MenuComponent: DefaultMentionMenu,
      }),
      [getItems]
    )
  )

  const handleChange = React.useCallback((nextValue: string) => {
    valueRef.current = nextValue
    setValue(nextValue)
  }, [])

  const handleSubmit = React.useCallback(() => {
    const nextMessage = valueRef.current.trim()
    if (!nextMessage) return

    setMessages((prev) => [nextMessage, ...prev].slice(0, 3))
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <RichTextarea
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Type @ to mention someone"
        aria-label="Message with mentions"
        features={[mentionFeature]}
      />

      <div className="text-muted-foreground text-xs">
        Transport value: <span className="font-mono">{value || '""'}</span>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-2 text-sm">
          {messages.map((message, index) => (
            <div
              key={`${message}-${index}`}
              className="bg-muted/40 rounded-md px-3 py-2"
            >
              {message}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
