import { Eye, Target } from 'lucide-react'
import { visionMission } from '../data/about'
import { sections } from '../data/nav'
import PageHero from '../components/PageHero'

export default function VisionMissionPage() {
  const v = visionMission
  const blocks = [
    { id: sections.vision, Icon: Eye, ...v.vision },
    { id: sections.mission, Icon: Target, ...v.mission },
  ]
  return (
    <>
      <PageHero eyebrow={v.eyebrow} title={v.title} body={v.intro} crumbs={[{ label: 'About' }, { label: v.title }]} />
      <div className="section bg-cream">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {blocks.map(({ id, Icon, title, body }) => (
            <section key={id} id={id} className="card scroll-mt-24 p-8" aria-labelledby={`${id}-title`}>
              <Icon className="h-8 w-8 text-orange" strokeWidth={1.75} aria-hidden />
              <h2 id={`${id}-title`} className="mt-4 text-3xl">
                {title}
              </h2>
              <p className="mt-4 text-lg">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
