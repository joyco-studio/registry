'use client'

import * as React from 'react'
import { SpritesheetSequencer } from '@/registry/joyco/blocks/spritesheet-sequencer'

// Spray can spritesheet: 4x4 grid, 16 frames
const SPRAY_CAN_SPRITE = '/static/sprites/spray-can.png'

export default function SpritesheetSequencerDemo() {
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [speed, setSpeed] = React.useState(100)
  const [frame, setFrame] = React.useState(0)

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-6 px-6 py-12">
      {/* Spray can animation */}
      <div className="size-32">
        <SpritesheetSequencer
          src={SPRAY_CAN_SPRITE}
          frameCount={16}
          frameDuration={speed}
          isPlaying={isPlaying}
          onFrameChange={setFrame}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="bg-muted hover:bg-muted/80 rounded px-3 py-1.5 font-mono text-xs"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-xs">Speed:</span>
          <input
            type="range"
            min={40}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-muted-foreground w-12 font-mono text-xs">{speed}ms</span>
        </div>

        <span className="text-muted-foreground font-mono text-xs">
          Frame: {frame + 1}/16
        </span>
      </div>
    </div>
  )
}
