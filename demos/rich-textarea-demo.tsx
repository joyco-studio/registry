'use client'

import * as React from 'react'

import { RichTextarea } from '@/registry/joyco/blocks/rich-textarea'

export default function RichTextareaDemo() {
  const [value, setValue] = React.useState('')
  const [messages, setMessages] = React.useState<string[]>([])
  const valueRef = React.useRef(value)

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
        placeholder="Write something short..."
        aria-label="Message"
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
