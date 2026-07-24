'use client'

import { useEffect, useRef, useCallback } from 'react'
import { getParticleCount } from '@/lib/utils/deviceCapability'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  rotation: number; rotationSpeed: number
  color: string; size: number
  alpha: number; alphaDecay: number
  shape: 'rect' | 'circle' | 'star'
}

const COLORS = [
  '#FF6B9D', '#C44AFF', '#FFD700', '#00CED1',
  '#FF4500', '#7FFF00', '#FF69B4', '#00FA9A',
  '#FFA07A', '#87CEEB',
]

interface ConfettiProps {
  isActive: boolean
  mode?: 'explosion' | 'rain'
  particleCount?: number
  onComplete?: () => void
  originX?: number  // 0-1 fraction of canvas width
  originY?: number
}

export default function Confetti({
  isActive,
  mode = 'explosion',
  particleCount = 150,
  onComplete,
  originX = 0.5,
  originY = 0.4,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const activeRef = useRef(false)

  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const count = getParticleCount(particleCount)
    const ox = canvas.width * originX
    const oy = canvas.height * originY

    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = mode === 'explosion'
        ? Math.random() * 18 + 4
        : Math.random() * 3 + 1

      return {
        x: mode === 'explosion' ? ox : Math.random() * canvas.width,
        y: mode === 'explosion' ? oy : -10,
        vx: mode === 'explosion'
          ? Math.cos(angle) * speed
          : (Math.random() - 0.5) * 4,
        vy: mode === 'explosion'
          ? Math.sin(angle) * speed - 8
          : Math.random() * 3 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        alpha: 1,
        alphaDecay: mode === 'explosion' ? Math.random() * 0.008 + 0.003 : 0.004,
        shape: (['rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
      }
    })
  }, [particleCount, mode, originX, originY])

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
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
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    activeRef.current = true
    particlesRef.current = createParticles(canvas)

    const animate = () => {
      if (!activeRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01)

      if (particlesRef.current.length === 0) {
        onComplete?.()
        activeRef.current = false
        return
      }

      // Replenish for rain mode
      if (mode === 'rain' && particlesRef.current.length < getParticleCount(particleCount) * 0.8) {
        const newParticles = createParticles(canvas).slice(0, 5)
        particlesRef.current.push(...newParticles)
      }

      for (const p of particlesRef.current) {
        // Physics
        p.vy += 0.35  // gravity
        p.vx *= 0.99  // air resistance
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.alpha -= p.alphaDecay

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2)
          ctx.fill()
        } else {
          drawStar(ctx, 0, 0, p.size / 2)
          ctx.fill()
        }

        ctx.restore()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      activeRef.current = false
      cancelAnimationFrame(animRef.current)
    }
  }, [isActive, createParticles, mode, particleCount, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      aria-hidden="true"
    />
  )
}
