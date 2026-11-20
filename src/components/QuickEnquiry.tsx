import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { allOils } from '../data/gradeFinder'
import { EMAIL_RE, enquiryMailto, hasEndpoint, PHONE_RE, SALES_EMAIL, sendEnquiry } from '../lib/enquiry'
import { Field } from './EnquiryForm'

const OTHER = 'Other'

type Values = { name: string; company: string; oil: string; volume: string; contact: string; message: string }
type Key = keyof Values
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'mailto' } | { kind: 'error'; detail: string }

const empty: Values = { name: '', company: '', oil: '', volume: '', contact: '', message: '' }

function validate(v: Values) {
  const e: Partial<Record<Key, string>> = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (v.company.trim().length < 2) e.company = 'Please enter your company name.'
  if (!v.oil) e.oil = 'Select the oil you refine.'
  const c = v.contact.trim()
  const digits = c.replace(/\D/g, '').length
  if (!c) e.contact = 'Enter an email or phone number so we can reply.'
  else if (!EMAIL_RE.test(c) && !(PHONE_RE.test(c) && digits >= 7 && digits <= 15)) e.contact = 'Enter a valid email (name@company.com) or phone number with country code.'
  return e
}

const fields = (v: Values) => ({
  Name: v.name.trim(),
  Company: v.company.trim(),
  'Oil type': v.oil,
  'Monthly volume': v.volume.trim() || '—',
  'Email / phone': v.contact.trim(),
  Message: v.message.trim() || '—',
})
const subjectFor = (v: Values) => `Quote request — ${v.company.trim() || v.name.trim()}`

/** Short home-page enquiry: the six fields a first quote needs. The full form lives on /contact. */
export default function QuickEnquiry() {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>(empty)
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const errors = validate(values)
  const id = (k: Key) => `${uid}-${k}`
  const errorFor = (k: Key) => (touched[k] ? errors[k] : undefined)

  const bind = (k: Key) => ({
    id: id(k),
    name: k,
    value: values[k],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setValues((v) => ({ ...v, [k]: value }))
    },
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    'aria-invalid': errorFor(k) ? true : undefined,
    'aria-describedby': errorFor(k) ? `${id(k)}-err` : k === 'volume' ? `${id(k)}-hint` : undefined,
  })

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
    if (!hasEndpoint) {
      window.location.href = enquiryMailto(fields(values), subjectFor(values))
      return setStatus({ kind: 'mailto' })
    }
    setStatus({ kind: 'sending' })
    try {
      const f = fields(values)
      await sendEnquiry(
        { name: f.Name, company: f.Company, oil_type: f['Oil type'], monthly_volume: f['Monthly volume'], contact: f['Email / phone'], message: f.Message },
        subjectFor(values),
      )
      setStatus({ kind: 'success' })
      setValues(empty)
      setTouched({})
    } catch (err) {
      setStatus({ kind: 'error', detail: err instanceof Error ? err.message : 'Network error' })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-labelledby={`${uid}-title`} aria-busy={sending} className="card relative p-6 text-body md:p-8">
      <h3 id={`${uid}-title`} className="text-xl text-ink">
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id={id('name')} label="Name" error={errorFor('name')} required>
          <input className="field" autoComplete="name" required {...bind('name')} />
        </Field>
        <Field id={id('company')} label="Company" error={errorFor('company')} required>
          <input className="field" autoComplete="organization" required {...bind('company')} />
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
        <Field id={id('volume')} label="Monthly volume" hint="e.g. 20 MT per month" error={errorFor('volume')}>
          <input className="field" inputMode="text" {...bind('volume')} />
        </Field>
        <Field id={id('contact')} label="Email or phone" error={errorFor('contact')} required className="sm:col-span-2">
          <input className="field" autoComplete="email" required {...bind('contact')} />
        </Field>
        <Field id={id('message')} label="Message" className="sm:col-span-2">
          <textarea className="field" rows={3} {...bind('message')} placeholder="Current bleaching earth, dosage, delivery location…" />
        </Field>
      </div>

      <button type="submit" className="btn btn-primary mt-5 w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          'Request a quote'
        )}
      </button>

      <div aria-live="polite" role="status">
        {status.kind === 'success' && (
          <p className="mt-4 flex items-start gap-2 rounded-lg border-l-4 border-accent bg-accent-tint px-4 py-3 text-sm text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" aria-hidden />
            Thank you — your enquiry has been sent. Our team will reply within one business day.
          </p>
        )}
        {status.kind === 'mailto' && (
          <p className="mt-4 rounded-lg border-l-4 border-accent bg-accent-tint px-4 py-3 text-sm text-ink">
            We’ve opened your email app with the enquiry filled in — just press send. Nothing opened? Email{' '}
            <a className="font-semibold text-accent-text underline" href={enquiryMailto(fields(values), subjectFor(values))}>
              {SALES_EMAIL}
            </a>
            .
          </p>
        )}
      </div>
      {status.kind === 'error' && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border-l-4 border-error bg-error/10 px-4 py-3 text-sm text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden />
          <span>
            Sorry, we couldn’t send your enquiry ({status.detail}). Please try again, or{' '}
            <a className="font-semibold text-accent-text underline" href={enquiryMailto(fields(values), subjectFor(values))}>
              email it to {SALES_EMAIL}
            </a>
            .
          </span>
        </div>
      )}
    </form>
  )
}
