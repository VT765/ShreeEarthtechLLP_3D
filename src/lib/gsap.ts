import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'power2.out', duration: 0.6 })
// Phones resize the viewport as the address bar slides in and out; refreshing the pinned hero on that made it jump.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
