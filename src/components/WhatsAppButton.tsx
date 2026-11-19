import { company } from '../data/company'
import SocialIcon from './Social'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello Shree Earthtech, I would like a quote for activated bleaching earth.')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1F9D55] text-white shadow-[0_12px_30px_rgba(7,31,58,0.3)] transition-transform duration-500 hover:-translate-y-1"
    >
      <span className="pulse-ring absolute inset-0 rounded-full bg-[#1F9D55]/40" aria-hidden />
      <SocialIcon name="WhatsApp" className="relative h-7 w-7" />
    </a>
  )
}
