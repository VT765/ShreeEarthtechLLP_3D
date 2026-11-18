import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import Products from '../sections/Products'
import Properties from '../sections/Properties'
import Applications from '../sections/Applications'
import Packaging from '../sections/Packaging'

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Activated Bleaching Earth, in three precise grades."
        body="Crystal Brite, Hyper Clean and Pure Choice — engineered from Gujarat bentonite for high bleaching efficiency, fast filtration and low oil retention."
      />
      <Products />
      <Properties />
      <Applications />
      <Packaging />
      <section className="bg-brand-gradient on-dark">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <h2 className="text-3xl">Not sure which grade fits your oil?</h2>
          <Link to="/contact" className="btn btn-gold">Request a lab trial <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  )
}
