import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className, ...props }, ref) => {
    const base = 'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-xl select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

    const variants = {
      primary: 'btn-gradient text-white shadow-glow-sm',
      outline: 'border border-border-default bg-bg-card text-text-primary hover:border-border-accent hover:bg-white/5',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
      danger: 'bg-rose/10 border border-rose/30 text-rose hover:bg-rose/20 hover:border-rose/60',
    }

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-7',
      md: 'text-sm px-4 py-2 h-9',
      lg: 'text-sm px-6 py-2.5 h-11',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
