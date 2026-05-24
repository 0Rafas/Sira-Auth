import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Minus, Maximize2, X, Search, Bell, FlaskConical,
  LayoutDashboard, SquareStack, Key, Users, Zap, CreditCard,
  Activity, LogOut, Settings, User, ChevronRight, Command,
  Sparkles, Webhook, FolderOpen, Variable, Shield, ScrollText,
  MessageSquare, UserCog, Wallet
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useAppStore } from '@/store/app.store'
import { clsx } from 'clsx'

// ── Page title map ────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/apps': 'Manage Applications',
  '/apps/new': 'Create Application',
  '/profile': 'Profile',
  '/settings': 'Account Settings',
  '/plans': 'Manage Plans',
  '/billing': 'Manage Billing',
  'licenses': 'Licenses',
  'users': 'Users',
  'tokens': 'Tokens',
  'subscriptions': 'Subscriptions',
  'chats': 'Chats',
  'sessions': 'Sessions',
  'webhooks': 'Webhooks',
  'files': 'Files',
  'variables': 'Variables',
  'rules': 'Rules',
  'event-logs': 'Event Logs',
  'settings': 'App Settings',
  'profile': 'Profile',
}

function getTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const last = pathname.split('/').filter(Boolean).pop() ?? ''
  return PAGE_TITLES[last] ?? 'Sira Auth'
}

// ── Search command palette ────────────────────────────────────
const COMMANDS = [
  { label: 'Dashboard',        icon: LayoutDashboard, path: '/dashboard', group: 'Navigation' },
  { label: 'Manage Apps',      icon: SquareStack,     path: '/apps',      group: 'Navigation' },
  { label: 'Profile',          icon: User,            path: '/profile',   group: 'Account' },
  { label: 'Account Settings', icon: UserCog,         path: '/settings',  group: 'Account' },
  { label: 'Manage Plans',     icon: Sparkles,        path: '/plans',     group: 'Account' },
  { label: 'Manage Billing',   icon: Wallet,          path: '/billing',   group: 'Account' },
  { label: 'Create Application', icon: SquareStack,   path: '/apps/new',  group: 'Actions' },
]

const APP_COMMANDS = (appId: string, appName: string) => [
  { label: `${appName} — Licenses`,     icon: Key,           path: `/apps/${appId}/licenses`,     group: appName },
  { label: `${appName} — Users`,        icon: Users,         path: `/apps/${appId}/users`,        group: appName },
  { label: `${appName} — Tokens`,       icon: Zap,           path: `/apps/${appId}/tokens`,       group: appName },
  { label: `${appName} — Subscriptions`,icon: CreditCard,    path: `/apps/${appId}/subscriptions`,group: appName },
  { label: `${appName} — Sessions`,     icon: Activity,      path: `/apps/${appId}/sessions`,     group: appName },
  { label: `${appName} — Webhooks`,     icon: Webhook,       path: `/apps/${appId}/webhooks`,     group: appName },
  { label: `${appName} — Files`,        icon: FolderOpen,    path: `/apps/${appId}/files`,        group: appName },
  { label: `${appName} — Variables`,    icon: Variable,      path: `/apps/${appId}/variables`,    group: appName },
  { label: `${appName} — Rules`,        icon: Shield,        path: `/apps/${appId}/rules`,        group: appName },
  { label: `${appName} — Chats`,        icon: MessageSquare, path: `/apps/${appId}/chats`,        group: appName },
  { label: `${appName} — Event Logs`,   icon: ScrollText,    path: `/apps/${appId}/event-logs`,   group: appName },
  { label: `${appName} — Settings`,     icon: Settings,      path: `/apps/${appId}/settings`,     group: appName },
]

function SearchPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const { apps, selectedApp } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const allCommands = [
    ...COMMANDS,
    ...(selectedApp ? APP_COMMANDS(selectedApp.id, selectedApp.name) : []),
    ...apps.filter(a => a.id !== selectedApp?.id).flatMap(a => APP_COMMANDS(a.id, a.name)),
  ]

  const filtered = query
    ? allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : allCommands

  // Group results — keep a flat list for keyboard navigation
  const groups = filtered.reduce<Record<string, typeof filtered>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {})

  // Flat ordered list (same order as rendered groups)
  const flat = Object.values(groups).flat()

  // ── FIXED: close first, then navigate (prevents freeze) ──
  const go = useCallback((idx: number) => {
    const cmd = flat[idx]
    if (!cmd) return
    onClose()                             // ← close FIRST
    setTimeout(() => navigate(cmd.path), 0) // ← navigate AFTER
  }, [flat, navigate, onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); go(active) }
      if (e.key === 'Escape')    { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flat.length, active, go, onClose])

  useEffect(() => { setActive(0) }, [query])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg glass rounded-2xl shadow-card border border-border-accent overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-2 px-4 border-b border-border-default">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none py-3.5"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border-default bg-bg-secondary text-text-muted">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="text-center py-8 text-xs text-text-muted">No results for "{query}"</div>
          ) : (
            (() => {
              // Build flat index counter without mutable JSX variable
              let counter = -1
              return Object.entries(groups).map(([group, cmds]) => (
                <div key={group}>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">{group}</p>
                  {cmds.map((cmd) => {
                    counter++
                    const idx = counter
                    const isActive = idx === active
                    return (
                      <button
                        key={cmd.path}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(idx)}
                        className={clsx(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          isActive ? 'bg-purple/15 text-purple-light' : 'text-text-secondary hover:bg-white/5'
                        )}
                      >
                        <cmd.icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-purple-light' : 'text-text-muted')} />
                        <span className="text-sm font-medium">{cmd.label}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-light" />}
                      </button>
                    )
                  })}
                </div>
              ))
            })()
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-border-default">
          <span className="text-[10px] text-text-muted flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 rounded border border-border-default bg-bg-secondary">↑↓</kbd>navigate
          </span>
          <span className="text-[10px] text-text-muted flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 rounded border border-border-default bg-bg-secondary">↵</kbd>open
          </span>
          <span className="text-[10px] text-text-muted flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 rounded border border-border-default bg-bg-secondary">ESC</kbd>close
          </span>
        </div>
      </motion.div>
    </div>
  )
}


// ── Notifications Panel ───────────────────────────────────────
type Notif = { id: number; title: string; desc: string; time: string; read: boolean }

const INITIAL_NOTIFS: Notif[] = [
  { id: 1, title: 'Welcome to Sira Auth', desc: 'Your dashboard is ready to use.', time: 'now', read: false },
  { id: 2, title: 'Backend not connected', desc: 'Connect your VPS API in settings.', time: '1m ago', read: false },
]

function NotifPanel({ notifs, onMarkAll }: { notifs: Notif[]; onMarkAll: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="fixed top-14 right-12 mt-1 w-80 bg-[#0d0d1a] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.85)] border border-border-accent overflow-hidden z-[999]"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <span className="text-sm font-semibold text-text-primary">Notifications</span>
        <button onClick={onMarkAll} className="text-[11px] text-purple-light hover:text-purple transition-colors">
          Mark all read
        </button>
      </div>
      <div className="divide-y divide-border-default max-h-72 overflow-y-auto">
        {notifs.map(n => (
          <div
            key={n.id}
            className={clsx(
              'flex gap-3 px-4 py-3 transition-colors',
              !n.read ? 'bg-purple/5' : 'hover:bg-white/3'
            )}
          >
            {!n.read && (
              <div className="w-1.5 h-1.5 rounded-full bg-purple-light mt-1.5 shrink-0" />
            )}
            {n.read && <div className="w-1.5 shrink-0" />}
            <div>
              <p className="text-xs font-medium text-text-primary">{n.title}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{n.desc}</p>
              <p className="text-[10px] text-text-muted mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── User Menu ─────────────────────────────────────────────────
function UserMenu({ onClose }: { onClose: () => void }) {
  const { user, logout, isDemoMode } = useAuthStore()
  const navigate = useNavigate()

  const doLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="fixed top-14 right-3 mt-1 w-56 bg-[#0d0d1a] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.85)] border border-border-accent overflow-hidden z-[999]"
    >
      {/* Profile info */}
      <div className="px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.username}</p>
            <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        {isDemoMode && (
          <div className="mt-2 px-2 py-1 rounded-lg bg-amber/10 border border-amber/20">
            <p className="text-[10px] text-amber text-center">Demo Mode — No server</p>
          </div>
        )}
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        {[
          { icon: User, label: 'Profile', action: () => { navigate('/profile'); onClose() } },
          { icon: Settings, label: 'Settings', action: () => { navigate('/settings'); onClose() } },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <item.icon className="w-4 h-4 text-text-muted" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="border-t border-border-default py-1.5">
        <button
          onClick={doLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose hover:bg-rose/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}

// ── Main TopBar ───────────────────────────────────────────────
export default function TopBar() {
  const { user, isDemoMode } = useAuthStore()
  const { pathname } = useLocation()
  const title = getTitle(pathname)

  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter(n => !n.read).length

  // Close panels when clicking outside their wrapper divs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
      if (userOpen && userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen, userOpen])

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleMin = () => window.electron?.minimize()
  const handleMax = () => window.electron?.maximize()
  const handleClose = () => window.electron?.close()

  return (
    <>
      <header className="flex items-center h-14 px-4 border-b border-border-default glass drag shrink-0 relative z-20">
        {/* Page title */}
        <h1 className="text-sm font-semibold text-text-primary no-drag">{title}</h1>

        {/* Demo badge */}
        {isDemoMode && (
          <div className="no-drag ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/10 border border-amber/30">
            <FlaskConical className="w-3 h-3 text-amber" />
            <span className="text-[11px] font-medium text-amber">Demo Mode</span>
          </div>
        )}

        <div className="flex-1" />

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="no-drag flex items-center gap-2 px-3 py-1.5 mr-3 rounded-lg border border-border-default bg-bg-card text-text-muted text-xs hover:border-border-accent hover:text-text-primary transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-2 text-[10px] px-1.5 py-0.5 rounded border border-border-default bg-bg-secondary flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="no-drag relative mr-1">
          <button
            onClick={() => { setNotifOpen(v => !v); setUserOpen(false) }}
            className={clsx(
              'relative p-2 rounded-lg transition-colors',
              notifOpen
                ? 'text-text-primary bg-white/8'
                : 'text-text-muted hover:text-text-primary hover:bg-white/5'
            )}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple border border-bg-primary" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <NotifPanel
                notifs={notifs}
                onMarkAll={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div ref={userRef} className="no-drag relative mr-3">
          <button
            onClick={() => { setUserOpen(v => !v); setNotifOpen(false) }}
            className={clsx(
              'w-8 h-8 rounded-full bg-gradient-to-br from-purple to-cyan overflow-hidden',
              'flex items-center justify-center text-white text-xs font-bold',
              'ring-2 transition-all',
              userOpen ? 'ring-purple/60' : 'ring-transparent hover:ring-purple/30'
            )}
          >
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : user?.username?.[0]?.toUpperCase() ?? 'U'}
          </button>
          <AnimatePresence>
            {userOpen && <UserMenu onClose={() => setUserOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* Window controls */}
        <div className="no-drag flex items-center gap-1">
          <button onClick={handleMin} title="Minimize"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleMax} title="Maximize"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors">
            <Maximize2 className="w-3 h-3" />
          </button>
          <button onClick={handleClose} title="Close"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-rose/80 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Search Palette portal */}
      <AnimatePresence>
        {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
