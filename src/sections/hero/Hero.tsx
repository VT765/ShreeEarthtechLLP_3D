import '../../styles/hero.css'
import PinnedHero from './PinnedHero'
import StackedHero from './StackedHero'
import { useHeroMode } from './useHeroMode'

/**
 * Home hero: a pinned, scroll-driven dotted-wireframe story (tiny bentonite crystals assemble into a miniature plant) with two
 * slides of copy. Reduced motion, low-power phones and no-WebGL browsers get the static stacked version.
 */
export default function Hero() {
  return useHeroMode() === 'pinned' ? <PinnedHero /> : <StackedHero />
}
