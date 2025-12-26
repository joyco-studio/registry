'use client'

import * as React from 'react'
import {
  HLSVideoPlayer,
  type HLSVideoPlayerRef,
  type HLSVideoError,
} from '@/registry/joyco/blocks/hls-video-player'
import { cn } from '@/lib/utils'

// Public HLS test stream (Mux)
const HLS_TEST_URL =
  'https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg.m3u8'

function HLSVideoPlayerDemo() {
  const playerRef = React.useRef<HLSVideoPlayerRef>(null)
  const [error, setError] = React.useState<HLSVideoError | null>(null)
  const [isReady, setIsReady] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isUsingHls, setIsUsingHls] = React.useState(false)

  const handleError = (err: HLSVideoError) => {
    setError(err)
  }

  const handleReady = () => {
    setIsReady(true)
    setIsUsingHls(playerRef.current?.isUsingHls ?? false)
  }

  const handleRetry = () => {
    setError(null)
    playerRef.current?.retry()
  }

  const togglePlay = () => {
    const video = playerRef.current?.video
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 p-6">
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        <HLSVideoPlayer
          ref={playerRef}
          src={HLS_TEST_URL}
          width={1920}
          height={1080}
          debug={false}
          onHlsError={handleError}
          onReady={handleReady}
          playsInline
          className="h-auto w-full"
        />

        {/* Custom overlay - demonstrates headless nature */}
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">Loading...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80">
            <div className="text-destructive text-sm">{error.message}</div>
            <button
              onClick={handleRetry}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-sm"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Custom controls - demonstrates headless UI approach */}
      <div className="flex w-full items-center justify-between gap-4">
        <button
          onClick={togglePlay}
          disabled={!isReady}
          className={cn(
            'rounded px-4 py-2 text-sm font-medium transition-colors',
            isReady
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span
            className={cn(
              'size-2 rounded-full',
              isUsingHls ? 'bg-blue-500' : 'bg-green-500'
            )}
          />
          {isUsingHls ? 'HLS.js' : 'Native HLS'}
        </div>
      </div>
    </div>
  )
}

export default HLSVideoPlayerDemo
