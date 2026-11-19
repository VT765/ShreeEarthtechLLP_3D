import { asset } from '../lib/asset'

type Props = { variant?: 'light' | 'dark'; className?: string }

/** Light bg → original logo. Dark bg → reversed: icon in original colours, white "Shree", light-gold "EarthTech LLP". */
export default function Logo({ variant = 'light', className = '' }: Props) {
  if (variant === 'light') {
    return (
      <img
        src={asset('logo-transparent.png')}
        alt="Shree Earthtech LLP"
        width={631}
        height={207}
        className={`h-11 w-auto min-w-[134px] ${className}`}
      />
    )
  }
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} role="img" aria-label="Shree Earthtech LLP">
      <img src={asset('logo-icon.png')} alt="" width={177} height={207} className="h-11 w-auto" />
      <span className="font-display font-extrabold leading-[0.95] tracking-tight" aria-hidden>
        <span className="block text-[20px] text-white">Shree</span>
        <span className="block text-[20px] text-gold-light">
          EarthTech <span className="text-[13px]">LLP</span>
        </span>
      </span>
    </span>
  )
}
