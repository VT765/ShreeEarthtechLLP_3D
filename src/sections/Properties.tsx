import { properties } from '../content'
import { useReveal } from '../hooks/useReveal'
import Icon from '../components/Icon'
import Tilt from '../components/Tilt'

/** Beveled, layered "3D" icon tile that lifts on hover. */
function Icon3D({ name }: { name: string }) {
  return (
    <div className="relative h-16 w-16 [transform-style:preserve-3d] transition-transform duration-700 ease-out-soft group-hover:[transform:rotateX(14deg)_rotateY(-18deg)]">
      <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl bg-gold-dark/80" />
      <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-2xl bg-brand-gold" />
      <span className="absolute inset-0 grid place-items-center rounded-2xl bg-[linear-gradient(145deg,#4E91CC_0%,#0C71C7_45%,#0C5A9E_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-6px_12px_rgba(5,15,30,0.25)] [transform:translateZ(14px)]">
        <Icon name={name} className="h-7 w-7 drop-shadow" />
      </span>
    </div>
  )
}

export default function Properties() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="properties" ref={ref} className="section grain bg-sand">
      <div className="container-x relative">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow" data-reveal>Properties & Advantages</p>
          <h2 className="h2 mt-4" data-reveal="0.05">Engineered adsorption, measured performance.</h2>
        </header>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((p, i) => (
            <Tilt key={p.title} data-reveal={(i % 4) * 0.07} className="card card-hover group p-6 transition-transform duration-300">
              <Icon3D name={p.icon} />
              <h3 className="mt-6 text-xl">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{p.body}</p>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  )
}
