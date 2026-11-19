import { useEffect, useRef } from 'react'

/** Side progress line filling from crude amber to clear gold. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleY(${p})`
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="pointer-events-none fixed right-2 top-1/2 z-40 hidden h-[40vh] w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-charcoal/10 md:block" aria-hidden>
      <div
        ref={bar}
        className="h-full w-full origin-top rounded-full"
        style={{ background: 'linear-gradient(180deg, #5C3214, #A14A0F, #D2691E, #F2A25C, #FFE3C2)', transform: 'scaleY(0)' }}
      />
    </div>
  )
}
