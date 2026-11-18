import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'

const Ctx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const show = useCallback((m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 4500)
  }, [])
  return (
    <Ctx.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[160] flex justify-center px-4">
        {msg && (
          <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border-l-4 border-teal bg-white p-4 shadow-[0_20px_50px_rgba(7,31,58,0.25)]">
            <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" strokeWidth={1.75} />
            <p className="text-sm text-ink">{msg}</p>
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}
