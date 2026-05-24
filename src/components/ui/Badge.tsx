import { clsx } from 'clsx'

type BadgeVariant = 'active' | 'inactive' | 'banned' | 'expired' | 'warning' | 'info' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  active: 'bg-emerald/15 text-emerald border-emerald/30',
  inactive: 'bg-text-muted/15 text-text-secondary border-text-muted/30',
  banned: 'bg-rose/15 text-rose border-rose/30',
  expired: 'bg-amber/15 text-amber border-amber/30',
  warning: 'bg-amber/15 text-amber border-amber/30',
  info: 'bg-cyan/15 text-cyan border-cyan/30',
  default: 'bg-purple/15 text-purple-light border-purple/30',
}

const dotColors: Record<BadgeVariant, string> = {
  active: 'bg-emerald',
  inactive: 'bg-text-muted',
  banned: 'bg-rose',
  expired: 'bg-amber',
  warning: 'bg-amber',
  info: 'bg-cyan',
  default: 'bg-purple-light',
}

export default function Badge({ variant = 'default', children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}
