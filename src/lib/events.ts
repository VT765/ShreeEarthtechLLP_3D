import type { GradeId } from '../data/products'
import { sections } from '../data/nav'
import { scrollToId } from '../components/SmoothScroll'

// Cross-section actions: gallery → enquiry form, grade finder → gallery.

const ENQUIRE = 'se:enquire'
const HIGHLIGHT = 'se:highlight-product'

/** Scroll to the enquiry form with `grade` pre-selected. */
export function enquireAbout(grade: GradeId) {
  window.dispatchEvent(new CustomEvent<GradeId>(ENQUIRE, { detail: grade }))
  scrollToId(sections.contact)
}

/** Scroll to the product gallery and highlight one card. */
export function highlightProduct(grade: GradeId) {
  window.dispatchEvent(new CustomEvent<GradeId>(HIGHLIGHT, { detail: grade }))
  scrollToId(sections.products)
}

function listen(name: string, fn: (grade: GradeId) => void) {
  const h = (e: Event) => fn((e as CustomEvent<GradeId>).detail)
  window.addEventListener(name, h)
  return () => window.removeEventListener(name, h)
}

export const onEnquire = (fn: (grade: GradeId) => void) => listen(ENQUIRE, fn)
export const onHighlightProduct = (fn: (grade: GradeId) => void) => listen(HIGHLIGHT, fn)
