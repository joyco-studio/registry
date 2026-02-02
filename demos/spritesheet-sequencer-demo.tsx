'use client'

import * as React from 'react'
import { SpritesheetSequencer } from '@/registry/joyco/blocks/spritesheet-sequencer'

// 8-bit coin spritesheet (4 frames in 2x2 grid)
// Each frame is 16x16 pixels, total spritesheet is 32x32
const COIN_SPRITE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="50%" style="stop-color:#FFA500"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
  </defs>
  <!-- Frame 0: Full coin -->
  <g transform="translate(0,0)">
    <rect x="5" y="2" width="6" height="1" fill="#FFD700"/>
    <rect x="3" y="3" width="10" height="1" fill="#FFD700"/>
    <rect x="2" y="4" width="12" height="1" fill="#FFD700"/>
    <rect x="2" y="5" width="12" height="1" fill="#FFA500"/>
    <rect x="1" y="6" width="14" height="1" fill="#FFA500"/>
    <rect x="1" y="7" width="14" height="1" fill="#FFA500"/>
    <rect x="1" y="8" width="14" height="1" fill="#FFA500"/>
    <rect x="1" y="9" width="14" height="1" fill="#B8860B"/>
    <rect x="2" y="10" width="12" height="1" fill="#B8860B"/>
    <rect x="2" y="11" width="12" height="1" fill="#B8860B"/>
    <rect x="3" y="12" width="10" height="1" fill="#B8860B"/>
    <rect x="5" y="13" width="6" height="1" fill="#B8860B"/>
  </g>
  <!-- Frame 1: 3/4 view -->
  <g transform="translate(16,0)">
    <rect x="6" y="2" width="4" height="1" fill="#FFD700"/>
    <rect x="5" y="3" width="6" height="1" fill="#FFD700"/>
    <rect x="4" y="4" width="8" height="1" fill="#FFD700"/>
    <rect x="4" y="5" width="8" height="1" fill="#FFA500"/>
    <rect x="3" y="6" width="10" height="1" fill="#FFA500"/>
    <rect x="3" y="7" width="10" height="1" fill="#FFA500"/>
    <rect x="3" y="8" width="10" height="1" fill="#FFA500"/>
    <rect x="3" y="9" width="10" height="1" fill="#B8860B"/>
    <rect x="4" y="10" width="8" height="1" fill="#B8860B"/>
    <rect x="4" y="11" width="8" height="1" fill="#B8860B"/>
    <rect x="5" y="12" width="6" height="1" fill="#B8860B"/>
    <rect x="6" y="13" width="4" height="1" fill="#B8860B"/>
  </g>
  <!-- Frame 2: Side view (thin) -->
  <g transform="translate(0,16)">
    <rect x="7" y="2" width="2" height="1" fill="#FFD700"/>
    <rect x="7" y="3" width="2" height="1" fill="#FFD700"/>
    <rect x="7" y="4" width="2" height="1" fill="#FFD700"/>
    <rect x="7" y="5" width="2" height="1" fill="#FFA500"/>
    <rect x="7" y="6" width="2" height="1" fill="#FFA500"/>
    <rect x="7" y="7" width="2" height="1" fill="#FFA500"/>
    <rect x="7" y="8" width="2" height="1" fill="#FFA500"/>
    <rect x="7" y="9" width="2" height="1" fill="#B8860B"/>
    <rect x="7" y="10" width="2" height="1" fill="#B8860B"/>
    <rect x="7" y="11" width="2" height="1" fill="#B8860B"/>
    <rect x="7" y="12" width="2" height="1" fill="#B8860B"/>
    <rect x="7" y="13" width="2" height="1" fill="#B8860B"/>
  </g>
  <!-- Frame 3: 3/4 view (reverse) -->
  <g transform="translate(16,16)">
    <rect x="6" y="2" width="4" height="1" fill="#FFD700"/>
    <rect x="5" y="3" width="6" height="1" fill="#FFD700"/>
    <rect x="4" y="4" width="8" height="1" fill="#FFD700"/>
    <rect x="4" y="5" width="8" height="1" fill="#FFA500"/>
    <rect x="3" y="6" width="10" height="1" fill="#FFA500"/>
    <rect x="3" y="7" width="10" height="1" fill="#FFA500"/>
    <rect x="3" y="8" width="10" height="1" fill="#FFA500"/>
    <rect x="3" y="9" width="10" height="1" fill="#B8860B"/>
    <rect x="4" y="10" width="8" height="1" fill="#B8860B"/>
    <rect x="4" y="11" width="8" height="1" fill="#B8860B"/>
    <rect x="5" y="12" width="6" height="1" fill="#B8860B"/>
    <rect x="6" y="13" width="4" height="1" fill="#B8860B"/>
  </g>
</svg>
`)}`

export default function SpritesheetSequencerDemo() {
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [speed, setSpeed] = React.useState(120)
  const [frame, setFrame] = React.useState(0)

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-6 px-6 py-12">
      <div className="flex items-center gap-8">
        {/* Single coin */}
        <div className="size-16">
          <SpritesheetSequencer
            src={COIN_SPRITE}
            frameCount={4}
            frameDuration={speed}
            isPlaying={isPlaying}
            onFrameChange={setFrame}
            className="[image-rendering:pixelated]"
          />
        </div>

        {/* Multiple coins with staggered timing */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="size-8">
              <SpritesheetSequencer
                src={COIN_SPRITE}
                frameCount={4}
                frameDuration={speed + i * 20}
                isPlaying={isPlaying}
                className="[image-rendering:pixelated]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
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
          Frame: {frame}
        </span>
      </div>
    </div>
  )
}
