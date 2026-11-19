import { sections } from '../../data/nav'
import HeroIllustration from './HeroIllustration'
import Slide1 from './Slide1'
import Slide2 from './Slide2'

/** No-pin fallback: static dotted art (crystals, then the assembled plant), both slides as ordinary sections. */
export default function StackedHero() {
  return (
    <div className="hero-root on-dark bg-dark-hero">
      <section id={sections.home} aria-labelledby="hero-title" className="relative overflow-hidden">
        <Slide1 art={<HeroIllustration variant="crystals" className="mx-auto max-w-[420px] lg:max-w-none" />} />
      </section>
      <section id={sections.about} aria-labelledby="about-title" className="relative scroll-mt-[70px] border-t border-white/10">
        <Slide2 art={<HeroIllustration variant="plant" />} />
      </section>
    </div>
  )
}
