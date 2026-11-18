import {
  Circle, ClipboardCheck, Droplets, Filter, FlaskConical, Gauge, Globe2, HeartHandshake, Layers, Leaf,
  Lightbulb, Scale, ShieldCheck, Sparkles, Wrench, type LucideIcon, type LucideProps,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  ClipboardCheck, Droplets, Filter, FlaskConical, Gauge, Globe2, HeartHandshake, Layers, Leaf,
  Lightbulb, Scale, ShieldCheck, Sparkles, Wrench,
}

/** Lucide icon by name (from content.ts), at the brand's 1.75px stroke. */
export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? Circle
  return <Cmp strokeWidth={1.75} aria-hidden {...props} />
}
