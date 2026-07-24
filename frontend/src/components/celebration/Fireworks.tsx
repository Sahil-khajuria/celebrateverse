'use client'

import { useEffect, useRef } from 'react'

interface FireworkBurst {
  x: number; y: number
  particles: FireworkParticle[]
  color: string
  done: boolean
}

interface FireworkParticle {
  x: number; y: number
  vx: number; vy: number
  alpha: number
  size: number
  trail: { x: number; y: number }[]
}

interface FireworksProps {
  isActive: boolean
  burstCount?: number
  onComplete?: () => void
}

const BURST_COLORS = ['#FFD700', '#FF6B9D', '#C44AFF', '#00FFFF', '#FFFFFF', '#FF4500', '#7FFF00']

export default function Fireworks({ isActive, burstCount = 5, onComplete }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const burstsRef = useRef<FireworkBurst[]>([])
  const activeRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!isActive) {
      activeRef.current = false
      cancelAnimationFrame(animRef.current)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      ctx?.clearRect(0, 0, canvas!.width, canvas!.height)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    activeRef.current = true
    burstsRef.current = []

    const createBurst = (delay: number) => {
      setTimeout(() => {
        if (!activeRef.current) return
        const x = canvas.width * (0.15 + Math.random() * 0.7)
        const y = canvas.height * (0.1 + Math.random() * 0.5)
        const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)]
        const particleCount = 40

        const burst: FireworkBurst = {
          x, y, color, done: false,
          particles: Array.from({ length: particleCount }, (_, i) => {
            const angle = (i / particleCount) * Math.PI * 2
            const speed = Math.random() * 8 + 3
            return {
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              size: Math.random() * 3 + 1,
              trail: [],
            }
          }),
        }
        burstsRef.current.push(burst)
      }, delay)
    }

    for (let i = 0; i < burstCount; i++) {
      createBurst(i * 400)
    }

    const animate = () => {
      if (!activeRef.current) return
      // Fade trail
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const burst of burstsRef.current) {
        if (burst.done) continue

        let allFaded = true
        for (const p of burst.particles) {
          if (p.alpha <= 0.02) continue
          allFaded = false

          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 6) p.trail.shift()

          p.vy += 0.15   // gravity
          p.vx *= 0.97
          p.vy *= 0.97
          p.x += p.vx
          p.y += p.vy
          p.alpha -= 0.012

          // Draw trail
          for (let t = 0; t < p.trail.length; t++) {
            const tAlpha = (t / p.trail.length) * p.alpha * 0.5
            ctx.beginPath()
            ctx.arc(p.trail[t].x, p.trail[t].y, p.size * (t / p.trail.length), 0, Math.PI * 2)
            ctx.fillStyle = burst.color.replace(')', `, ${tAlpha})`).replace('rgb', 'rgba').replace('#', 'rgba(')
            // Use hex color with alpha
            ctx.globalAlpha = tAlpha
            ctx.fillStyle = burst.color
            ctx.fill()
          }

          ctx.globalAlpha = p.alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = burst.color
          ctx.fill()
          ctx.globalAlpha = 1
        }
        if (allFaded) burst.done = true
      }

      const allDone = burstsRef.current.length >= burstCount &&
        burstsRef.current.every((b) => b.done)

      if (allDone) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onComplete?.()
        return
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      activeRef.current = false
      cancelAnimationFrame(animRef.current)
    }
  }, [isActive, burstCount, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
      aria-hidden="true"
    />
  )
}
