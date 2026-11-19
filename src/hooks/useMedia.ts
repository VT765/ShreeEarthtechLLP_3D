import { useEffect, useState } from 'react'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

/**
 * Rough low-end heuristic used to lighten 3D. Both thresholds sit below 4 on purpose: Safari reports 4 cores
 * for every device with fewer than 8 (a privacy clamp — a 6-core iPhone 15 Pro says 4) and has no
 * deviceMemory, so "4" says nothing there. Chrome rounds deviceMemory to 0.25 / 0.5 / 1 / 2 / 4 / 8.
 */
export function isLowEnd() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
}
