'use client'

import { ReactNode } from 'react'
import { HTMLMotionProps, motion } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  onClick,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={[
        'glass',
        hover ? 'cursor-pointer card-hover' : '',
        gradient ? 'gradient-border' : '',
        'relative overflow-hidden',
        className,
      ].join(' ')}
      {...props}
    >
      {/* Subtle inner highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
