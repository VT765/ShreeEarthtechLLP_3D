import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/** Fades/rises every `[data-reveal]` child of the returned ref as it enters the viewport. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]', el).forEach((node) => {
        gsap.from(node, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: Number(node.dataset.reveal || 0),
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])
  return ref
}
