import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { company } from '../data/company'
import { allOils } from '../data/gradeFinder'
import { productById, products, type GradeId } from '../data/products'
import { onEnquire } from '../lib/events'
import { useToast } from './Toast'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT?.trim() || ''
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY?.trim() || ''
const SALES_EMAIL = company.emails[1] ?? company.emails[0]
const OTHER = 'Other'
const NOT_SURE = 'not-sure'

type Values = {
  name: string
  company: string
  email: string
  phone: string
  oil: string
  oilOther: string
  grade: GradeId | typeof NOT_SURE | ''
  quantity: string
  message: string
}
type Key = keyof Values
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'mailto' } | { kind: 'error'; detail: string }

const empty: Values = { name: '', company: '', email: '', phone: '', oil: '', oilOther: '', grade: '', quantity: '', message: '' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/

function validate(v: Values) {
  const e: Partial<Record<Key, string>> = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (v.company.trim().length < 2) e.company = 'Please enter your company name.'
  if (!v.email.trim()) e.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address, e.g. name@company.com.'
  const digits = v.phone.replace(/\D/g, '').length
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.'
  else if (!PHONE_RE.test(v.phone.trim()) || digits < 7 || digits > 15) e.phone = 'Enter a valid phone number with country code, e.g. +91 98765 43210.'
  if (!v.oil) e.oil = 'Select the oil you refine.'
  else if (v.oil === OTHER && v.oilOther.trim().length < 2) e.oilOther = 'Tell us which oil.'
  if (!v.grade) e.grade = 'Select a product, or “Not sure”.'
  if (v.quantity.trim() && !(Number(v.quantity) > 0)) e.quantity = 'Enter a quantity greater than 0.'
  return e
}

const gradeLabel = (g: Values['grade']) => (g && g !== NOT_SURE ? productById(g).name : 'Not sure — please recommend')

/** Human-readable fields, shared by the JSON payload and the mailto body. */
function summary(v: Values) {
  return {
    Name: v.name.trim(),
    Company: v.company.trim(),
    Email: v.email.trim(),
    Phone: v.phone.trim(),
    'Oil type': v.oil === OTHER ? `Other: ${v.oilOther.trim()}` : v.oil,
    Product: gradeLabel(v.grade),
    'Quantity (MT/month)': v.quantity.trim() || '—',
    Message: v.message.trim() || '—',
  }
}

const subjectFor = (v: Values) => `Enquiry: ${gradeLabel(v.grade)} — ${v.company.trim() || v.name.trim()}`

function mailtoHref(v: Values) {
  const body = Object.entries(summary(v))
    .map(([k, val]) => `${k}: ${val}`)
    .join('\n')
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subjectFor(v))}&body=${encodeURIComponent(body)}`
}

async function post(v: Values) {
  const s = summary(v)
  const payload: Record<string, string> = {
    name: s.Name,
    company: s.Company,
    email: s.Email,
    phone: s.Phone,
    oil_type: s['Oil type'],
    product: s.Product,
    quantity_mt_per_month: s['Quantity (MT/month)'],
    message: s.Message,
    subject: subjectFor(v), // Web3Forms email subject
    _subject: subjectFor(v), // Formspree email subject
    from_name: company.name + ' website',
  }
  if (ACCESS_KEY) payload.access_key = ACCESS_KEY
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string; error?: string } | null
  // Formspree: non-2xx on failure. Web3Forms: { success: false, message } (sometimes with 200).
  if (!res.ok || data?.success === false) throw new Error(data?.message || data?.error || `Request failed (${res.status})`)
}

function Field({ id, label, error, hint, required, className = '', children }: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="text-error" aria-hidden>
            {' '}*
          </span>
        ) : (
          <span className="font-normal text-stone"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 flex items-start gap-1 text-xs font-medium text-error">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

export default function EnquiryForm() {
  const uid = useId()
  const toast = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>(empty)
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [preselected, setPreselected] = useState<GradeId | null>(null)
  const errors = validate(values)
  const id = (k: Key) => `${uid}-${k}`
  const errorFor = (k: Key) => (touched[k] ? errors[k] : undefined)

  // Pre-select the product when any "Enquire" button is pressed elsewhere on the page.
  useEffect(
    () =>
      onEnquire((grade) => {
        setValues((v) => ({ ...v, grade }))
        setPreselected(grade)
      }),
    [],
  )

  // Success / mailto messages fade back to idle.
  useEffect(() => {
    if (status.kind !== 'success' && status.kind !== 'mailto') return
    const t = window.setTimeout(() => setStatus({ kind: 'idle' }), 8000)
    return () => window.clearTimeout(t)
  }, [status.kind])

  const bind = (k: Key) => {
    const err = errorFor(k)
    const hintId = k === 'phone' || k === 'quantity' ? `${id(k)}-hint` : undefined
    return {
      id: id(k),
      name: k,
      value: values[k],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        setValues((v) => ({ ...v, [k]: value }))
        if (k === 'grade') setPreselected(null)
      },
      onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${id(k)}-err` : hintId,
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status.kind === 'sending') return
    // Honeypot: bots fill every field; silently pretend success.
    const trap = formRef.current?.elements.namedItem('website') as HTMLInputElement | null
    if (trap?.value) return setStatus({ kind: 'success' })

    const keys = Object.keys(errors) as Key[]
    if (keys.length) {
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])))
      document.getElementById(id(keys[0]))?.focus()
      return
    }

    if (!ENDPOINT) {
      // No backend configured: hand the enquiry to the visitor's email app.
      window.location.href = mailtoHref(values)
      setStatus({ kind: 'mailto' })
      return
    }

    setStatus({ kind: 'sending' })
    try {
      await post(values)
      const first = values.name.trim().split(/\s+/)[0]
      toast(`Thank you, ${first}! Our technical sales team will reply within one business day.`)
      setStatus({ kind: 'success' })
      setValues(empty)
      setTouched({})
      setPreselected(null)
    } catch (err) {
      setStatus({ kind: 'error', detail: err instanceof Error ? err.message : 'Network error' })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-labelledby={`${uid}-title`} aria-busy={sending} className="card relative p-6 text-slate md:p-8">
      <h3 id={`${uid}-title`} className="text-2xl text-ink">
        Request a quote
      </h3>
      <p className="mt-1 text-sm text-stone">
        Fields marked <span className="text-error">*</span> are required. We reply within one business day.
      </p>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={id('name')} label="Full name" error={errorFor('name')} required>
          <input className="field" autoComplete="name" required {...bind('name')} />
        </Field>
        <Field id={id('company')} label="Company" error={errorFor('company')} required>
          <input className="field" autoComplete="organization" required {...bind('company')} />
        </Field>
        <Field id={id('email')} label="Email" error={errorFor('email')} required>
          <input className="field" type="email" autoComplete="email" inputMode="email" required {...bind('email')} />
        </Field>
        <Field id={id('phone')} label="Phone" error={errorFor('phone')} hint="Include country code, e.g. +91." required>
          <input className="field" type="tel" autoComplete="tel" inputMode="tel" required {...bind('phone')} />
        </Field>
        <Field id={id('oil')} label="Oil type" error={errorFor('oil')} required>
          <select className="field" required {...bind('oil')}>
            <option value="">Select an oil…</option>
            {allOils.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
            <option value={OTHER}>{OTHER}</option>
          </select>
        </Field>
        <Field id={id('grade')} label="Product / grade" error={errorFor('grade')} required>
          <select className="field" required {...bind('grade')}>
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value={NOT_SURE}>Not sure — please recommend</option>
          </select>
        </Field>
        {values.oil === OTHER && (
          <Field id={id('oilOther')} label="Which oil?" error={errorFor('oilOther')} required className="sm:col-span-2">
            <input className="field" required {...bind('oilOther')} />
          </Field>
        )}
        <Field id={id('quantity')} label="Required quantity (MT/month)" error={errorFor('quantity')} hint="Approximate is fine." className="sm:col-span-2">
          <input className="field" type="number" min={0} step="any" inputMode="decimal" {...bind('quantity')} />
        </Field>
        <Field id={id('message')} label="Message" className="sm:col-span-2">
          <textarea className="field" rows={4} {...bind('message')} placeholder="Current bleaching earth, dosage, delivery location…" />
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone">Your details are used only to respond to your enquiry.</p>
        <button type="submit" className="btn btn-primary shrink-0 disabled:cursor-wait disabled:opacity-70" disabled={sending}>
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send enquiry <Send className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>

      {/* Status region: announced politely; errors assertively. */}
      <div aria-live="polite" role="status">
        {preselected && status.kind === 'idle' && (
          <p className="mt-5 rounded-lg bg-sky-tint px-4 py-3 text-sm text-ink">
            Enquiring about <strong>{productById(preselected).name}</strong> — product pre-selected below.
          </p>
        )}
        {sending && <p className="mt-5 text-sm text-stone">Sending your enquiry…</p>}
        {status.kind === 'success' && (
          <p className="mt-5 flex items-start gap-2 rounded-lg border-l-4 border-teal bg-teal/10 px-4 py-3 text-sm text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
            Thank you — your enquiry has been sent. Our team will get back to you shortly.
          </p>
        )}
        {status.kind === 'mailto' && (
          <p className="mt-5 flex items-start gap-2 rounded-lg border-l-4 border-brand-blue bg-sky-tint px-4 py-3 text-sm text-ink">
            <Send className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden />
            <span>
              We’ve opened your email app with the enquiry filled in — just press send. Nothing opened? Email us at{' '}
              <a className="font-semibold text-brand-blue underline" href={mailtoHref(values)}>
                {SALES_EMAIL}
              </a>
              .
            </span>
          </p>
        )}
      </div>
      {status.kind === 'error' && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-lg border-l-4 border-error bg-error/10 px-4 py-3 text-sm text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden />
          <span>
            Sorry, we couldn’t send your enquiry ({status.detail}). Please try again, or{' '}
            <a className="font-semibold text-brand-blue underline" href={mailtoHref(values)}>
              email it to {SALES_EMAIL}
            </a>{' '}
            instead — your details will be filled in.
          </span>
        </div>
      )}
    </form>
  )
}
