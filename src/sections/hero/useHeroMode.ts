import { useState } from 'react'
import { isLowEnd, useIsMobile, useReducedMotion } from '../../hooks/useMedia'

/** Quick capability probe; the throwaway context is released straight away. */
function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

/** 'pinned' = scroll-driven 3D hero; 'stacked' = static SVG with the two slides as normal sections. */
export function useHeroMode(): 'pinned' | 'stacked' {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [webgl] = useState(hasWebGL)
  const [lowEnd] = useState(isLowEnd)
  return reduced || !webgl || (mobile && lowEnd) ? 'stacked' : 'pinned'
}
