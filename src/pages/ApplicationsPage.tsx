import { sectionCopy } from '../data/sections'
import PageHero from '../components/PageHero'
import GradeFinder from '../sections/GradeFinder'

/** Applications: the interactive Grade Finder across edible, industrial and waste oils. */
export default function ApplicationsPage() {
  const c = sectionCopy.applicationsSummary
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} body={c.body} crumbs={[{ label: 'Applications' }]} />
      <GradeFinder />
    </>
  )
}
