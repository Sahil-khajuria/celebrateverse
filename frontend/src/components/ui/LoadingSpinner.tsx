'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  overlay?: boolean
  label?: string
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
}

export default function LoadingSpinner({ size = 'md', overlay = false, label }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={[
          sizeMap[size],
          'rounded-full border-white/10 border-t-primary animate-spin',
        ].join(' ')}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <p className="text-text-muted text-sm">{label}</p>}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}
