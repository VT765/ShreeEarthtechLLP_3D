import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { products, specs } from '../../data/products'

/** Full specification comparison, collapsed by default behind a disclosure button. */
export default function SpecTable() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return (
    <div className="mt-14">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-clay bg-white px-5 py-4 text-left shadow-[0_10px_30px_rgba(27,23,20,0.06)] transition-colors hover:border-accent md:px-6"
      >
        <span>
          <span className="block font-display text-lg font-bold text-ink md:text-xl">Full specification comparison</span>
          <span className="mt-0.5 block text-sm text-stone">
            {specs.length} parameters across {products.length} grades
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-accent-text">
          <span className="hidden sm:inline">{open ? 'Hide table' : 'Show table'}</span>
          <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
        </span>
      </button>

      <div id={panelId} className="collapse-rows" data-open={open} inert={!open}>
        <div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-clay shadow-[0_10px_30px_rgba(27,23,20,0.08)]" tabIndex={open ? 0 : -1} role="region" aria-label="Specification table, scrolls horizontally">
            <table className="spec-table w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Technical specifications of each activated bleaching earth grade</caption>
              <thead>
                <tr>
                  <th scope="col" className="px-5 py-4">
                    Parameter
                  </th>
                  {products.map((p) => (
                    <th key={p.id} scope="col" className="px-5 py-4">
                      {p.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((s) => (
                  <tr key={s.parameter}>
                    <th scope="row" className="px-5 py-3.5">
                      {s.parameter}
                    </th>
                    {s.values.map((v, i) => (
                      <td key={products[i].id} className="bg-white px-5 py-3.5">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
