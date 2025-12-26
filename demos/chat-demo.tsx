'use client'

import * as React from 'react'
import {
  ChatInputArea,
  ChatInputField,
  ChatInputSubmit,
  ChatViewport,
  ChatMessages,
  ChatMessageRow,
  ChatMessageBubble,
  ChatMessageTime,
  Chat,
} from '@/registry/joyco/blocks/chat'

interface Message {
  id: string
  content: string
  role: 'self' | 'peer' | 'system'
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How can I help you today?',
    role: 'peer',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    content: "I'd like to learn more about this chat component.",
    role: 'self',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: '3',
    content:
      "It's a flexible chat UI built with React. It supports streaming messages, auto-scroll, and different message types like self, peer, and system.",
    role: 'peer',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
]

export function ChatDemo() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState('')

  const handleSubmit = (msg: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: msg,
      role: 'self',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simulate assistant response with typewriter effect
    const responseText = 'This is a simulated response from the assistant.'
    const assistantId = (Date.now() + 1).toString()
    const assistantTimestamp = new Date()

    setTimeout(() => {
      // Add empty message first
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          content: '',
          role: 'peer',
          timestamp: assistantTimestamp,
        },
      ])

      // Stream tokens like LLM output
      const tokens = responseText.split(/(\s+)/).filter(Boolean)
      let tokenIndex = 0

      const streamToken = () => {
        if (tokenIndex >= tokens.length) return

        tokenIndex++
        const currentContent = tokens.slice(0, tokenIndex).join('')

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: currentContent } : m
          )
        )

        // Random delay between 30-80ms to simulate natural token streaming
        const delay = 30 + Math.random() * 50
        setTimeout(streamToken, delay)
      }

      streamToken()
    }, 500)
  }

  return (
    <Chat onSubmit={handleSubmit}>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-8">
        <ChatViewport className="h-96">
          {messages.length === 0 ? (
            <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
              Start a conversation...
            </div>
          ) : (
            <ChatMessages className="w-full">
              {messages.map((message) => (
                <ChatMessageRow key={message.id} variant={message.role}>
                  <ChatMessageBubble variant={message.role}>
                    {message.content}
                  </ChatMessageBubble>
                  <ChatMessageTime dateTime={message.timestamp.toISOString()}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </ChatMessageTime>
                </ChatMessageRow>
              ))}
            </ChatMessages>
          )}
        </ChatViewport>

        <ChatInputArea>
          <ChatInputField
            multiline
            placeholder="Type a message..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
          />
          <ChatInputSubmit disabled={!input.trim()} />
        </ChatInputArea>
      </div>
    </Chat>
  )
}

export default ChatDemo
