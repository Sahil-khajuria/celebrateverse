'use client'

import { useEffect, useRef } from 'react'
import { getParticleCount } from '@/lib/utils/deviceCapability'

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
  phase: number
}

interface StarFieldProps {
  starCount?: number
  opacity?: number
  className?: string
}

export default function StarField({ starCount = 200, opacity = 1, className = '' }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const count = getParticleCount(starCount)

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      // Re-init stars on resize
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    let t = 0
    const draw = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      t += 0.01
      for (const star of starsRef.current) {
        const alpha = (Math.sin(t * star.speed + star.phase) + 1) / 2
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8 * opacity})`
        ctx.fill()

        // Occasional cross-sparkle for brighter stars
        if (star.radius > 1.2 && alpha > 0.7) {
          const len = star.radius * 3
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3 * opacity})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(star.x - len, star.y)
          ctx.lineTo(star.x + len, star.y)
          ctx.moveTo(star.x, star.y - len)
          ctx.lineTo(star.x, star.y + len)
          ctx.stroke()
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      observer.disconnect()
    }
  }, [starCount, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={['absolute inset-0 w-full h-full pointer-events-none', className].join(' ')}
      aria-hidden="true"
    />
  )
}
