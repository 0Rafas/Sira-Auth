import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

interface EmptyStateProps {
  icon?: LucideIcon
  emoji?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({ icon: Icon, emoji, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      {emoji && <span className="text-4xl mb-4">{emoji}</span>}
      {Icon && !emoji && (
        <div className="w-14 h-14 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-purple-light" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="text-xs text-text-muted mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
