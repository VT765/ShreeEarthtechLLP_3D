import { company } from '../data/company'

// Form backend (Web3Forms / Formspree style). Without an endpoint, enquiries open the visitor's email app.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT?.trim() || ''
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY?.trim() || ''

export const SALES_EMAIL = company.emails[1] ?? company.emails[0]
export const hasEndpoint = !!ENDPOINT

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_RE = /^\+?[\d\s().-]{7,20}$/

/** A mailto: link with the human-readable fields as the body. */
export function enquiryMailto(fields: Record<string, string>, subject: string) {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** POSTs the enquiry; throws with the service's message on failure. */
export async function sendEnquiry(payload: Record<string, string>, subject: string) {
  const body: Record<string, string> = {
    ...payload,
    subject, // Web3Forms email subject
    _subject: subject, // Formspree email subject
    from_name: company.name + ' website',
  }
  if (ACCESS_KEY) body.access_key = ACCESS_KEY
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string; error?: string } | null
  // Formspree: non-2xx on failure. Web3Forms: { success: false, message } (sometimes with 200).
  if (!res.ok || data?.success === false) throw new Error(data?.message || data?.error || `Request failed (${res.status})`)
}
