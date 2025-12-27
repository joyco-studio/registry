'use client'

import * as React from 'react'
import {
  Chat,
  ChatViewport,
  ChatMessages,
  ChatMessageRow,
  ChatMessageBubble,
  ChatMessageTime,
  ChatMessageAvatar,
} from '@/registry/joyco/blocks/chat'
import {
  Mention,
  MentionInput,
  MentionList,
  MentionItem,
  MentionItemText,
  MentionHighlight,
} from '@/components/ui/mention'
import { ArrowUpIcon } from 'lucide-react'

const MTPRZ_AVATAR = '/static/matiasperz.jpg'
const JOYBOY_AVATAR = '/static/joyboy.jpg'
const FABROOS_AVATAR = '/static/fabroos.jpg'

const USERS = [
  { id: '1', name: 'Matias Perez', username: 'matiasperz', avatar: MTPRZ_AVATAR },
  { id: '3', name: 'Joyboy', username: 'joyboy', avatar: JOYBOY_AVATAR },
  { id: '4', name: 'Fabroos', username: 'fabroos', avatar: FABROOS_AVATAR },
]

type Message = {
  id: string
  avatar: string
  name: string
  content: string
  role: 'self' | 'peer'
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    avatar: FABROOS_AVATAR,
    name: 'Fabroos',
    content: 'Hey team! Who should I assign this task to?',
    role: 'peer',
    timestamp: new Date('2025-12-26T10:00:00.000Z'),
  },
  {
    id: '2',
    avatar: JOYBOY_AVATAR,
    name: 'Joyboy',
    content: '@matiasperz would be perfect for this!',
    role: 'peer',
    timestamp: new Date('2025-12-26T10:01:00.000Z'),
  },
]

export function ChatWithMentionDemo() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      avatar: MTPRZ_AVATAR,
      name: 'You',
      content: input,
      role: 'self',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
  }

  return (
    <Chat>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
        <ChatViewport className="h-80">
          <ChatMessages className="w-full py-3">
            {messages.map((message) => (
              <ChatMessageRow key={message.id} variant={message.role}>
                <ChatMessageAvatar
                  src={message.avatar}
                  fallback={message.name.charAt(0)}
                  alt={message.name}
                />
                <ChatMessageBubble>
                  <MentionHighlight
                    mentionClassName="bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded px-0.5 font-medium"
                  >
                    {message.content}
                  </MentionHighlight>
                </ChatMessageBubble>
                <ChatMessageTime dateTime={message.timestamp} />
              </ChatMessageRow>
            ))}
          </ChatMessages>
        </ChatViewport>

        <form onSubmit={handleSubmit}>
          <Mention value={input} onValueChange={setInput} trigger="@">
            <div className="border-input bg-background flex items-center gap-2 rounded-xl border p-1.5 pl-4">
              <div className="relative flex-1">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center text-sm"
                >
                  <MentionHighlight
                    mentionClassName="bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded px-0.5 font-medium"
                  >
                    {input}
                  </MentionHighlight>
                </div>
                <MentionInput
                  placeholder="Type @ to mention someone..."
                  className="w-full bg-transparent text-sm text-transparent caret-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg disabled:opacity-50"
              >
                <ArrowUpIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </button>
            </div>
            <MentionList className="bg-popover text-popover-foreground absolute bottom-full left-0 z-50 mb-2 max-h-48 w-64 overflow-auto rounded-md border p-1 shadow-md">
              {USERS.map((user) => (
                <MentionItem
                  key={user.id}
                  value={user.username}
                  className="hover:bg-accent hover:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <MentionItemText className="font-medium">
                      {user.name}
                    </MentionItemText>
                    <span className="text-muted-foreground text-xs">
                      @{user.username}
                    </span>
                  </div>
                </MentionItem>
              ))}
            </MentionList>
          </Mention>
        </form>
      </div>
    </Chat>
  )
}

export default ChatWithMentionDemo
