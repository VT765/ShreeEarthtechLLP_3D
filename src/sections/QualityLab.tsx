import { ClipboardCheck } from 'lucide-react'
import { lab } from '../content'
import { useReveal } from '../hooks/useReveal'
import LabArt from './LabArt'

export default function QualityLab() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="quality" ref={ref} className="section grain bg-ivory">
      <div className="container-x relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow" data-reveal>{lab.eyebrow}</p>
            <h2 className="h2 mt-4" data-reveal="0.05">{lab.title}</h2>
            <p className="mt-5 text-lg" data-reveal="0.1">{lab.body}</p>
            <div className="card mt-8 flex items-center gap-4 p-5" data-reveal="0.15">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky-tint text-brand-blue">
                <ClipboardCheck className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <p className="text-sm">
                <strong className="block text-ink">Certificate of Analysis</strong>
                issued with every dispatch, retained samples kept for traceability.
              </p>
            </div>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8 xl:grid-cols-5">
          {lab.instruments.map((ins, i) => (
            <li key={ins.name} data-reveal={(i % 5) * 0.05} className="card card-hover group flex flex-col items-center p-5 text-center">
              <div className="transition-transform duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:scale-105">
                <LabArt kind={ins.kind} />
              </div>
              <p className="mt-3 text-sm font-semibold leading-snug text-ink">{ins.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
