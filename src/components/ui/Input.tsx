import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconRight?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full h-10 rounded-xl border bg-bg-card text-text-primary text-sm',
              'placeholder:text-text-muted transition-all duration-200',
              'focus:outline-none focus:border-purple/60 focus:ring-2 focus:ring-purple/20',
              icon ? 'pl-9' : 'pl-3',
              iconRight ? 'pr-9' : 'pr-3',
              error
                ? 'border-rose/60 focus:border-rose focus:ring-rose/20'
                : 'border-border-default hover:border-border-accent',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-rose">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
