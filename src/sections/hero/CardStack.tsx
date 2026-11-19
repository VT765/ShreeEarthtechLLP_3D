import { useEffect, useState } from 'react'
import { hero } from '../../data/hero'
import { asset } from '../../lib/asset'
import { useReducedMotion } from '../../hooks/useMedia'

// Fan positions, front → back. Each card moves one slot back every few seconds.
const slots = [
  'z-30 translate-x-0 -rotate-6 scale-100',
  'z-20 translate-x-[68%] rotate-2 scale-[0.92] opacity-90',
  'z-10 translate-x-[136%] rotate-[9deg] scale-[0.84] opacity-75',
]

/** Three rounded product cards that slowly cycle which one sits in front. */
export default function CardStack({ className = '' }: { className?: string }) {
  const cards = hero.slide1.cards
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || paused) return
    const id = setInterval(() => setFront((f) => (f + 1) % cards.length), 3200)
    return () => clearInterval(id)
  }, [reduced, paused, cards.length])

  return (
    <ul
      className={`relative h-[104px] w-[208px] sm:h-[150px] sm:w-[290px] ${className}`}
      aria-label="Our product grades"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {cards.map((card, i) => (
        <li
          key={card.src}
          className={`absolute left-0 top-0 h-full w-[86px] origin-bottom-left overflow-hidden rounded-2xl border border-white/15 bg-navy shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-[transform,opacity] duration-1000 ease-out-soft sm:w-[120px] ${
            slots[(i - front + cards.length) % cards.length]
          }`}
        >
          <img src={asset(card.src)} alt={card.alt} className="h-full w-full object-cover" width={240} height={300} decoding="async" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-semibold text-white sm:text-xs">
            {card.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
