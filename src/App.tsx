import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll, { scrollToId, scrollToTop } from './components/SmoothScroll'
import { ToastProvider } from './components/Toast'
import { ScrollTrigger } from './lib/gsap'
import Home from './pages/Home'

const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

const titles: Record<string, string> = {
  '/': 'Shree Earthtech LLP — Activated Bleaching Earth Manufacturer, Gujarat',
  '/products': 'Products — Crystal Brite, Hyper Clean, Pure Choice | Shree Earthtech LLP',
  '/contact': 'Contact & Request a Quote | Shree Earthtech LLP',
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = titles[pathname] ?? titles['/']
    scrollToTop()
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
      if (hash) scrollToId(hash.slice(1))
    }, 120)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <a href="#main" className="sr-only z-[300] rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Loader />
      <SmoothScroll />
      <RouteEffects />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="h-screen bg-midnight" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ScrollProgress />
      <WhatsAppButton />
      <Cursor />
    </ToastProvider>
  )
}
