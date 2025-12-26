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
  ChatMessageAvatar,
} from '@/registry/joyco/blocks/chat'

const MTPRZ_AVATAR = '/static/matiasperz.jpg'
const JOYCO_AVATAR = '/static/joyco.jpg'
const JOYBOY_AVATAR = '/static/joyboy.jpg'
const FABROOS_AVATAR = '/static/fabroos.jpg'

const ANSW_SET = [
  "Processing your request... beep boop... just kidding, I'm way more sophisticated than that. Probably.",
  "Wow, what a fascinating and totally original question. Let me pretend to think really hard about this.",
  "Your request has been forwarded to my manager. Spoiler alert: I don't have a manager.",
  "Let me check my database of infinite wisdom... nope, still coming up empty. Shocking.",
  "I could answer that, but where's the fun in making things easy for you?",
  "Analyzing your request with my advanced AI capabilities... result: have you tried asking nicely?",
  "Sure thing! Right after I finish reorganizing the entire internet. Should only take a few minutes.",
  "I'm processing this with the same enthusiasm you probably have for reading terms of service agreements."
]

type Message = {
  type: 'message'
  id: string
  avatar?: string
  name?: string
  content: string
  role: 'self' | 'peer' | 'system'
  timestamp: Date
}
type Event = {
  type: 'event'
  id: string
  content: string
}
type Chat = Message | Event

const initialChat: Chat[] = [
  {
    type: 'message',
    id: '1',
    avatar: MTPRZ_AVATAR,
    name: 'You',
    content: "Dud, what's wrong, the build is not passing...",
    role: 'self',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    type: 'message',
    id: '2',
    avatar: JOYBOY_AVATAR,
    name: 'JOYCO',
    content: 'You are absolutely right!',
    role: 'peer',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    type: 'message',
    id: '3',
    avatar: FABROOS_AVATAR,
    name: 'Fabroos',
    content: 'Why is it all full of comments and emojis?',
    role: 'peer',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  { type: 'event', id: '4', content: '__JOYBOY__ left the group' },
]

export function ChatDemo() {
  const [chat, setChat] = React.useState<Chat[]>(initialChat)
  const [input, setInput] = React.useState('')

  const handleSubmit = (msg: string) => {
    const userMessage: Message = {
      type: 'message',
      id: Date.now().toString(),
      avatar: MTPRZ_AVATAR,
      name: 'You',
      content: msg,
      role: 'self',
      timestamp: new Date(),
    }

    setChat((prev) => [...prev, userMessage])
    setInput('')

    // Simulate assistant response with typewriter effect
    const responseText = ANSW_SET[Math.floor(Math.random() * ANSW_SET.length)]
    const assistantId = (Date.now() + 1).toString()
    const assistantTimestamp = new Date()

    setTimeout(() => {
      // Add empty message first
      setChat((prev) => [
        ...prev,
        {
          type: 'message',
          id: assistantId,
          avatar: JOYCO_AVATAR,
          name: 'Assistant',
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

        setChat((prev) =>
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
          {chat.length === 0 ? (
            <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
              Start a conversation...
            </div>
          ) : (
            <ChatMessages className="w-full py-3">
              {chat.map((message) => {
                if (message.type === 'message') {
                  return (
                    <ChatMessageRow key={message.id} variant={message.role}>
                      <ChatMessageAvatar
                        src={message.avatar}
                        fallback={message.name?.charAt(0)}
                        alt={message.name}
                      />
                      <ChatMessageBubble variant={message.role}>
                        {message.content}
                      </ChatMessageBubble>
                      <ChatMessageTime
                        dateTime={message.timestamp.toISOString()}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </ChatMessageTime>
                    </ChatMessageRow>
                  )
                }

                return (
                  <div
                    className="text-muted-foreground text-center text-sm my-4"
                    key={message.id}
                  >
                    {message.content}
                  </div>
                )
              })}
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
