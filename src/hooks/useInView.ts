import { useEffect, useRef, useState } from 'react'

/** True once (or while, if `once` is false) the element is near the viewport. */
export function useInView<T extends Element>(rootMargin = '200px', once = false) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, once])
  return [ref, inView] as const
}
