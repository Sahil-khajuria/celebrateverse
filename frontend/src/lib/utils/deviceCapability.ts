export type DeviceTier = 'high' | 'mid' | 'low'

/**
 * Detect device performance tier based on hardware concurrency and memory
 */
export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'mid'

  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4

  if (cores >= 8 && memory >= 4) return 'high'
  if (cores >= 4 && memory >= 2) return 'mid'
  return 'low'
}

/**
 * Whether the device can handle Three.js 3D rendering
 */
export function shouldUse3D(): boolean {
  if (typeof window === 'undefined') return false
  if (isCalmModePreferred()) return false

  const tier = getDeviceTier()
  return tier !== 'low'
}

/**
 * Scale particle counts based on device tier
 */
export function getParticleCount(base: number): number {
  const tier = getDeviceTier()
  switch (tier) {
    case 'high': return base
    case 'mid': return Math.floor(base * 0.6)
    case 'low': return Math.floor(base * 0.3)
  }
}

/**
 * Whether the user prefers reduced motion
 */
export function isCalmModePreferred(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Whether the device is mobile/touch
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 768
  )
}

/**
 * Get recommended canvas resolution scale
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') return 1
  const tier = getDeviceTier()
  const deviceRatio = Math.min(window.devicePixelRatio || 1, 2)
  if (tier === 'low') return 1
  if (tier === 'mid') return Math.min(deviceRatio, 1.5)
  return deviceRatio
}
