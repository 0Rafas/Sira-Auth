// Custom styled Select — matches the dark glassmorphism theme
// Replaces all native <select> elements for consistent styling

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export default function Select({
  value, onChange, options, placeholder = 'Select...', disabled, className, size = 'md',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div ref={ref} className={clsx('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
        className={clsx(
          'w-full flex items-center justify-between gap-2 rounded-xl border transition-all text-left',
          size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-10 px-3 text-sm',
          open
            ? 'border-purple/60 ring-2 ring-purple/15 bg-bg-card text-text-primary'
            : 'border-border-default bg-bg-card text-text-primary hover:border-border-accent',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span className={clsx(!selected && 'text-text-muted')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={clsx('w-3.5 h-3.5 text-text-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute z-[200] left-0 right-0 top-full mt-1.5 bg-[#12121a] rounded-xl border border-border-accent shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map(opt => {
                const isActive = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors',
                      isActive
                        ? 'bg-purple/15 text-purple-light'
                        : 'text-text-primary hover:bg-white/5 hover:text-text-primary',
                    )}
                  >
                    {opt.label}
                    {isActive && <Check className="w-3.5 h-3.5 text-purple-light shrink-0" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
