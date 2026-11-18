import { why } from '../content'
import { useReveal } from '../hooks/useReveal'
import Icon from '../components/Icon'
import { SWatermark } from '../components/SCurve'

export default function WhyUs() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="why" ref={ref} className="section on-dark bg-dark-hero relative overflow-hidden">
      <SWatermark className="absolute -left-20 -top-10 h-[620px] w-[500px] text-white/[0.03]" />
      <div className="container-x relative">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow" data-reveal>Why Shree Earthtech</p>
          <h2 className="h2 mt-4" data-reveal="0.05">A partner refiners rely on.</h2>
        </header>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((w, i) => (
            <li key={w.title} data-reveal={(i % 3) * 0.07} className="card-dark group p-7 transition-transform duration-500 ease-out-soft hover:-translate-y-1">
              <Icon name={w.icon} className="h-8 w-8 text-gold-light transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mt-5 text-xl">{w.title}</h3>
              <p className="mt-2 text-[15px] text-white/75">{w.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
