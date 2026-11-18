import { useState, type FormEvent } from 'react'
import { Clock, Download, Lock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { company, contact } from '../content'
import { useReveal } from '../hooks/useReveal'
import { useToast } from '../components/Toast'

type Fields = 'name' | 'company' | 'email' | 'phone' | 'country' | 'oil' | 'grade' | 'qty' | 'message'
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

function validate(f: Record<Fields, string>) {
  const e: Partial<Record<Fields, string>> = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (f.company.trim().length < 2) e.company = 'Please enter your company.'
  if (!emailOk(f.email)) e.email = 'Enter a valid email address.'
  if (f.phone && !/^[+\d][\d\s-]{6,}$/.test(f.phone)) e.phone = 'Enter a valid phone number.'
  if (!f.country.trim()) e.country = 'Please enter your country.'
  if (!f.oil) e.oil = 'Select an oil type.'
  if (f.qty && (isNaN(Number(f.qty)) || Number(f.qty) <= 0)) e.qty = 'Enter a positive quantity.'
  return e
}

function Field({ id, label, error, children, required }: { id: string; label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-error" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}

function CatalogueGate() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const toast = useToast()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!emailOk(email)) return setErr('Enter a valid email to unlock the catalogue.')
    setErr('')
    // PLACEHOLDER: wire to your CRM / email service, then serve /catalogue.pdf
    toast('Thank you! The catalogue link has been sent to ' + email + '.')
    setEmail('')
  }
  return (
    <form onSubmit={submit} noValidate className="on-dark card-dark mt-6 p-6">
      <p className="flex items-center gap-2 font-display font-bold text-white">
        <Lock className="h-4 w-4 text-gold-light" strokeWidth={1.75} /> Download Catalogue
      </p>
      <p className="mt-1 text-sm text-white/75">Product range, TDS and packaging options in one PDF.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="cat-email" className="sr-only">Work email</label>
        <input id="cat-email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field flex-1" aria-invalid={!!err} aria-describedby={err ? 'cat-err' : undefined} />
        <button className="btn btn-gold h-12">
          <Download className="h-4 w-4" /> Get PDF
        </button>
      </div>
      {err && <p id="cat-err" className="mt-2 text-xs font-medium text-[#FF9C9C]">{err}</p>}
    </form>
  )
}

export default function Contact() {
  const ref = useReveal<HTMLElement>()
  const toast = useToast()
  const empty: Record<Fields, string> = { name: '', company: '', email: '', phone: '', country: 'India', oil: '', grade: '', qty: '', message: '' }
  const [f, setF] = useState(empty)
  const [touched, setTouched] = useState<Partial<Record<Fields, boolean>>>({})
  const [sending, setSending] = useState(false)
  const errors = validate(f)
  const show = (k: Fields) => (touched[k] ? errors[k] : undefined)
  const bind = (k: Fields) => ({
    id: `f-${k}`,
    name: k,
    value: f[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value }),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    'aria-invalid': !!show(k),
    'aria-describedby': show(k) ? `f-${k}-err` : undefined,
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(Object.fromEntries(Object.keys(f).map((k) => [k, true])))
    if (Object.keys(errors).length) {
      document.getElementById(`f-${Object.keys(errors)[0]}`)?.focus()
      return
    }
    setSending(true)
    // PLACEHOLDER: POST to your backend / form service here.
    await new Promise((r) => setTimeout(r, 900))
    setSending(false)
    setF(empty)
    setTouched({})
    toast(`Thank you, ${f.name.split(' ')[0]}! Our technical sales team will reply within one business day.`)
  }

  return (
    <section id="contact" ref={ref} className="section grain bg-sand">
      <div className="container-x relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>{contact.eyebrow}</p>
          <h2 className="h2 mt-4" data-reveal="0.05">{contact.title}</h2>
          <p className="mt-5 text-lg" data-reveal="0.1">{contact.body}</p>
          <ul className="mt-8 space-y-4 text-[15px]" data-reveal="0.15">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" strokeWidth={1.75} />{company.address}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" strokeWidth={1.75} />
              <span>{company.phones.map((p, i) => <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-brand-blue">{p}{i < company.phones.length - 1 ? ' / ' : ''}</a>)}</span>
            </li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" strokeWidth={1.75} />
              <span>{company.emails.map((m, i) => <a key={m} href={`mailto:${m}`} className="hover:text-brand-blue">{m}{i < company.emails.length - 1 ? ' · ' : ''}</a>)}</span>
            </li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" strokeWidth={1.75} />{company.hours}</li>
          </ul>
          <div data-reveal="0.2">
            <CatalogueGate />
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal="0.1">
          <form onSubmit={submit} noValidate className="card relative p-6 md:p-8" aria-label="Request for quotation">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="f-name" label="Name" error={show('name')} required><input className="field" autoComplete="name" {...bind('name')} /></Field>
              <Field id="f-company" label="Company" error={show('company')} required><input className="field" autoComplete="organization" {...bind('company')} /></Field>
              <Field id="f-email" label="Email" error={show('email')} required><input className="field" type="email" autoComplete="email" {...bind('email')} /></Field>
              <Field id="f-phone" label="Phone" error={show('phone')}><input className="field" type="tel" autoComplete="tel" {...bind('phone')} /></Field>
              <Field id="f-country" label="Country" error={show('country')} required><input className="field" autoComplete="country-name" {...bind('country')} /></Field>
              <Field id="f-oil" label="Oil type" error={show('oil')} required>
                <select className="field" {...bind('oil')}>
                  <option value="">Select…</option>
                  {contact.oilTypes.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="f-grade" label="Grade interest">
                <select className="field" {...bind('grade')}>
                  <option value="">Select…</option>
                  {contact.grades.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="f-qty" label="Monthly requirement (MT)" error={show('qty')}><input className="field" inputMode="decimal" {...bind('qty')} /></Field>
              <div className="sm:col-span-2">
                <Field id="f-message" label="Message"><textarea className="field" rows={4} {...bind('message')} /></Field>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-stone">We respect your privacy — details are used only to respond to your enquiry.</p>
              <button className="btn btn-primary" disabled={sending}>
                {sending ? 'Sending…' : <>Send request <Send className="h-4 w-4" /></>}
              </button>
            </div>
          </form>
          <div className="card mt-6 overflow-hidden">
            <iframe title="Shree Earthtech location map" src={company.mapEmbed} className="h-64 w-full grayscale-[30%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  )
}
