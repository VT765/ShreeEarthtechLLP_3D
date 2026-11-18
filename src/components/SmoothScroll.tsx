import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

let lenis: Lenis | null = null

export function scrollToId(id: string) {
  const el = id === 'home' ? 0 : document.getElementById(id)
  if (el === null) return
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  else if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate })
  else window.scrollTo(0, 0)
}

/** Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
  return null
}
