import { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll, { scrollToId, scrollToTop } from './components/SmoothScroll'
import { ToastProvider } from './components/Toast'
import { ScrollTrigger } from './lib/gsap'
import Home from './pages/Home'
import { routes } from './data/routes'
import { productBySlug } from './data/products'

// Inner pages load on demand; the home page stays in the main chunk.
const CompanyProfilePage = lazy(() => import('./pages/CompanyProfilePage'))
const VisionMissionPage = lazy(() => import('./pages/VisionMissionPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'))

const SITE = 'Shree Earthtech LLP'
const titles: Record<string, string> = {
  [routes.home]: `${SITE} — Activated Bleaching Earth Manufacturer, Gujarat`,
  [routes.companyProfile]: `Company Profile | ${SITE}`,
  [routes.visionMission]: `Vision & Mission | ${SITE}`,
  [routes.products]: `Products — Crystal Brite, Hyper Clean, Pure Choice | ${SITE}`,
  [routes.applications]: `Applications & Grade Finder | ${SITE}`,
  [routes.certificates]: `Certificates — ISO, Kosher & Halal | ${SITE}`,
  [routes.contact]: `Contact & Request a Quote | ${SITE}`,
}

function titleFor(pathname: string) {
  const product = pathname.startsWith(`${routes.products}/`) && productBySlug(pathname.split('/').pop())
  return product ? `${product.name} | ${SITE}` : (titles[pathname] ?? titles[routes.home])
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef('')
  useEffect(() => {
    document.title = titleFor(pathname)
    const newPage = lastPath.current !== pathname
    lastPath.current = pathname
    if (newPage && !hash) scrollToTop()
    // Lazy pages may take a moment to mount: retry until the #target exists.
    let tries = 0
    let t = 0
    const go = () => {
      ScrollTrigger.refresh()
      if (!hash) return
      const id = hash.slice(1)
      if (document.getElementById(id) || id === 'home') scrollToId(id)
      else if (++tries < 20) t = window.setTimeout(go, 100)
    }
    t = window.setTimeout(go, 120)
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
        <Suspense fallback={<div className="min-h-screen bg-charcoal" />}>
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={routes.companyProfile} element={<CompanyProfilePage />} />
            <Route path={routes.visionMission} element={<VisionMissionPage />} />
            <Route path={routes.products} element={<ProductsPage />} />
            <Route path={`${routes.products}/:slug`} element={<ProductPage />} />
            <Route path={routes.applications} element={<ApplicationsPage />} />
            <Route path={routes.certificates} element={<CertificatesPage />} />
            <Route path={routes.contact} element={<ContactPage />} />
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
