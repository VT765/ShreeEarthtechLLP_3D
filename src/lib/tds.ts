import { company, products, specs, type GradeId } from '../content'

/** Generates a printable Technical Data Sheet for a grade and downloads it. */
export function downloadTDS(id: GradeId) {
  const idx = products.findIndex((p) => p.id === id)
  const p = products[idx]
  const rows = specs.map((s) => `<tr><th>${s.parameter}</th><td>${s.values[idx]}</td></tr>`).join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${p.name} — TDS</title>
<style>body{font:15px/1.6 Inter,Arial,sans-serif;color:#1A1D24;max-width:760px;margin:40px auto;padding:0 24px}
h1{color:#0C5A9E;margin-bottom:0}p.s{color:#8F620C;margin-top:4px;font-weight:600}
table{width:100%;border-collapse:collapse;margin:24px 0}th,td{border:1px solid #E6D8C0;padding:10px 12px;text-align:left}
th{background:#071F3A;color:#fff;font-weight:500;width:65%}td{font-family:monospace}
footer{margin-top:32px;font-size:13px;color:#4F5562;border-top:2px solid #BF8311;padding-top:12px}</style></head>
<body><h1>${p.name}</h1><p class="s">${p.line} · Technical Data Sheet</p><p>${p.body}</p>
<table>${rows}</table>
<p><strong>Packaging:</strong> 25 kg / 50 kg paper bags, Jumbo bags (FIBC), bulk.</p>
<p><strong>Storage:</strong> Store in a cool, dry place away from moisture. Shelf life 24 months in original packing.</p>
<footer>${company.name} · ${company.addressLabel}: ${company.address}<br>${company.phones.join(' / ')} · ${company.emails.join(' · ')}<br>
Typical values for guidance only; refer to batch Certificate of Analysis.</footer></body></html>`
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${p.name.replace(/\s+/g, '-')}-TDS.html`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
