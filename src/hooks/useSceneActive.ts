import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

// One animated WebGL scene at a time: every scene reports how many pixels of it are on screen, and only the
// most visible one runs its render loop. Nothing runs while the tab is hidden.

const visible = new Map<symbol, number>()
const listeners = new Set<() => void>()
let leader: symbol | null = null

function elect() {
  let best: symbol | null = null
  let max = 0
  if (!document.hidden) visible.forEach((px, key) => px > max && ((max = px), (best = key)))
  if (best === leader) return
  leader = best
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', elect)

/** True while the element behind `ref` is the most visible scene on the page. */
export function useSceneActive(ref: RefObject<Element | null>) {
  const [key] = useState(() => Symbol('scene'))
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        visible.set(key, e.isIntersecting ? e.intersectionRect.height * e.intersectionRect.width : 0)
        elect()
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      visible.delete(key)
      elect()
    }
  }, [ref, key])
  return useSyncExternalStore(subscribe, () => leader === key)
}
