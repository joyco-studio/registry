'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as React from 'react'

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

const GRID_SIZE = 12
const INITIAL_SPEED = 150

export function SnakeGame() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = React.useState(180)
  const [snake, setSnake] = React.useState<Position[]>([{ x: 6, y: 6 }])
  const [food, setFood] = React.useState<Position>({ x: 9, y: 9 })
  const [direction, setDirection] = React.useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [theme, setTheme] = React.useState('')

  const directionRef = React.useRef(direction)

  // Update ref when direction changes
  React.useEffect(() => {
    directionRef.current = direction
  }, [direction])

  // Listen for theme changes on <html> element
  React.useEffect(() => {
    const html = document.documentElement
    setTheme(html.className)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          setTheme(html.className)
        }
      }
    })

    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const cellSize = canvasSize / GRID_SIZE

  // Responsive sizing - ensure canvas is multiple of GRID_SIZE for clean pixels
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      // Round down to nearest multiple of GRID_SIZE to avoid sub-pixel artifacts
      const size = Math.floor(width / GRID_SIZE) * GRID_SIZE
      setCanvasSize(size || GRID_SIZE * 15) // fallback to 180
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const generateFood = React.useCallback((currentSnake: Position[]) => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y))
    return newFood
  }, [])

  const resetGame = React.useCallback(() => {
    const initialSnake = [{ x: 6, y: 6 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
  }, [generateFood])

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return

      const key = e.key
      const current = directionRef.current

      if ((key === 'ArrowUp' || key === 'w') && current !== 'DOWN') {
        setDirection('UP')
        e.preventDefault()
      } else if ((key === 'ArrowDown' || key === 's') && current !== 'UP') {
        setDirection('DOWN')
        e.preventDefault()
      } else if ((key === 'ArrowLeft' || key === 'a') && current !== 'RIGHT') {
        setDirection('LEFT')
        e.preventDefault()
      } else if ((key === 'ArrowRight' || key === 'd') && current !== 'LEFT') {
        setDirection('RIGHT')
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying])

  // Game loop
  React.useEffect(() => {
    if (!isPlaying || gameOver) return

    const moveSnake = () => {
      setSnake((prev) => {
        const head = { ...prev[0] }
        const dir = directionRef.current

        if (dir === 'UP') head.y -= 1
        if (dir === 'DOWN') head.y += 1
        if (dir === 'LEFT') head.x -= 1
        if (dir === 'RIGHT') head.x += 1

        // Check wall collision
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true)
          setIsPlaying(false)
          return prev
        }

        // Check self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true)
          setIsPlaying(false)
          return prev
        }

        const newSnake = [head, ...prev]

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1)
          setFood(generateFood(newSnake))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const interval = setInterval(moveSnake, INITIAL_SPEED)
    return () => clearInterval(interval)
  }, [isPlaying, gameOver, food, generateFood])

  // Draw game with HiDPI support
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Handle device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasSize * dpr
    canvas.height = canvasSize * dpr

    // Disable image smoothing for crisp pixel edges
    ctx.imageSmoothingEnabled = false

    ctx.scale(dpr, dpr)

    // Get computed styles for colors (CSS vars are already complete color values like oklch())
    const computedStyle = getComputedStyle(canvas)
    const primaryColor = computedStyle.getPropertyValue('--primary').trim()
    const foregroundColor = computedStyle
      .getPropertyValue('--foreground')
      .trim()

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Use integer cell size
    const cell = Math.floor(cellSize)

    // Draw snake (foreground color - solid squares)
    ctx.fillStyle = foregroundColor
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * cell, segment.y * cell, cell, cell)
    })

    // Draw food (primary color - solid square)
    ctx.fillStyle = primaryColor
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell)
  }, [snake, food, canvasSize, cellSize, theme])

  return (
    <div className="bg-background flex w-full flex-col items-center">
      <div ref={containerRef} className="bg-muted aspect-square w-full">
        <canvas
          ref={canvasRef}
          style={{ width: canvasSize, height: canvasSize }}
          className="bg-muted size-full"
        />
      </div>
      <div className="text-muted-foreground border-background flex w-full items-center justify-center border-t-4 font-mono text-xs">
        {gameOver ? (
          <div className="flex w-full items-center gap-1 pl-2">
            <span className="flex-1 uppercase">
              <span className="font-bold">Game over!</span> Score: {score}{' '}
            </span>
            <Button size="sm" onClick={resetGame} className="uppercase">
              Play again
            </Button>
          </div>
        ) : isPlaying ? (
          <div className="flex w-full items-center gap-1">
            <div className="flex flex-1 px-3 whitespace-pre">
              Score:
              <span className="text-foreground font-bold">
                {` `}
                {score}
              </span>
            </div>
            <span className="flex h-8 w-full shrink items-center pl-2">
              <div className="ml-auto flex gap-1">
                {['W', 'A', 'S', 'D'].map((key) => (
                  <Badge variant="key" key={key}>
                    {key}
                  </Badge>
                ))}
              </div>
            </span>
          </div>
        ) : (
          <Button size="sm" onClick={resetGame} className="flex-1 uppercase">
            Play Snake
          </Button>
        )}
      </div>
    </div>
  )
}
