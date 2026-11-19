import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll, { scrollToId, scrollToTop } from './components/SmoothScroll'
import { ToastProvider } from './components/Toast'
import { ScrollTrigger } from './lib/gsap'
import Home from './pages/Home'
import { sections } from './data/nav'

const titles: Record<string, string> = {
  '/': 'Shree Earthtech LLP — Activated Bleaching Earth Manufacturer, Gujarat',
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
      <SmoothScroll />
      <RouteEffects />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Old sub-pages now live as home-page sections. */}
          <Route path="/products" element={<Navigate to={`/#${sections.products}`} replace />} />
          <Route path="/contact" element={<Navigate to={`/#${sections.contact}`} replace />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <ScrollProgress />
      <WhatsAppButton />
      <Cursor />
    </ToastProvider>
  )
}
