'use client'

import { Typewriter } from '@/registry/joyco/blocks/typewriter'

export default function TypewriterDemo() {
  return (
    <div className="flex min-h-[120px] items-center justify-center px-6 py-12">
      <span className="text-foreground min-w-0 font-mono text-sm leading-6 whitespace-pre">
        npx shadcn@latest add{' '}
        <Typewriter
          msPerChar={55}
          pauseMs={650}
          deleteMsPerChar={40}
          gapMs={180}
          texts={['joyco/mobile-menu', 'joyco/typewriter', 'joyco/chat']}
          className='**:data-[slot="caret"]:animate-caret-blink'
        />
      </span>
    </div>
  )
}
