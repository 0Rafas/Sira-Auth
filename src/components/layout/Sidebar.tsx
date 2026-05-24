import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  LayoutDashboard, SquareStack, Key, Users, Zap, CreditCard,
  MessageSquare, Activity, Webhook, FolderOpen, Variable,
  Shield, ScrollText, Settings, ChevronDown, Plus, PanelLeftClose, PanelLeftOpen, LogOut, Sparkles,
  UserCircle, SlidersHorizontal, Wallet
} from 'lucide-react'
import { useAppStore } from '@/store/app.store'
import { useAuthStore } from '@/store/auth.store'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { appsApi } from '@/api/apps.api'
import type { Application } from '@/types'

const APP_NAV = [
  { label: 'Manage Apps', icon: SquareStack, to: '/apps' },
  { label: 'Licenses', icon: Key, to: (id: string) => `/apps/${id}/licenses` },
  { label: 'Users', icon: Users, to: (id: string) => `/apps/${id}/users` },
  { label: 'Tokens', icon: Zap, to: (id: string) => `/apps/${id}/tokens` },
  { label: 'Subscriptions', icon: CreditCard, to: (id: string) => `/apps/${id}/subscriptions` },
  { label: 'Chats', icon: MessageSquare, to: (id: string) => `/apps/${id}/chats` },
  { label: 'Sessions', icon: Activity, to: (id: string) => `/apps/${id}/sessions` },
  { label: 'Webhooks', icon: Webhook, to: (id: string) => `/apps/${id}/webhooks` },
  { label: 'Files', icon: FolderOpen, to: (id: string) => `/apps/${id}/files` },
  { label: 'Variables', icon: Variable, to: (id: string) => `/apps/${id}/variables` },
  { label: 'Rules', icon: Shield, to: (id: string) => `/apps/${id}/rules` },
  { label: 'Event Logs', icon: ScrollText, to: (id: string) => `/apps/${id}/event-logs` },
  { label: 'Settings', icon: Settings, to: (id: string) => `/apps/${id}/settings` },
]

export default function Sidebar() {
  const { selectedApp, apps, sidebarCollapsed, toggleSidebar, setSelectedApp, setApps } = useAppStore()
  const { user, logout, isDemoMode } = useAuthStore()
  const navigate = useNavigate()
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false)

  // Fetch apps from API and sync into store
  const { data: appsData } = useQuery({
    queryKey: ['apps'],
    queryFn: appsApi.getAll,
    enabled: !isDemoMode,
    refetchInterval: 30_000,
  })

  useEffect(() => {
    if (!isDemoMode && appsData?.data) {
      setApps(appsData.data)
    }
  }, [appsData, isDemoMode])

  const w = sidebarCollapsed ? 64 : 260

  const handleSelectApp = (app: Application) => {
    setSelectedApp(app)
    setAppSwitcherOpen(false)
    navigate(`/apps/${app.id}/licenses`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-full shrink-0 glass border-r border-border-default overflow-hidden z-20"
      style={{ width: w }}
    >
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-border-default drag">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center glow-sm shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm gradient-text">Sira Auth</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="no-drag p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors ml-auto"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* App Switcher */}
      <div className="px-2 py-2 border-b border-border-default shrink-0">
        <button
          onClick={() => { if (!sidebarCollapsed) setAppSwitcherOpen(!appSwitcherOpen) }}
          className={clsx(
            'w-full flex items-center gap-2.5 p-2 rounded-xl transition-all duration-200',
            'hover:bg-white/5 text-left no-drag',
            appSwitcherOpen && 'bg-white/5'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple/30 to-cyan/20 border border-border-accent flex items-center justify-center shrink-0">
            <SquareStack className="w-4 h-4 text-purple-light" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                {selectedApp?.name ?? 'Select App'}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {selectedApp ? `v${selectedApp.version}` : 'No app selected'}
              </p>
            </div>
          )}
          {!sidebarCollapsed && (
            <ChevronDown className={clsx('w-3.5 h-3.5 text-text-muted transition-transform', appSwitcherOpen && 'rotate-180')} />
          )}
        </button>

        {/* App dropdown */}
        <AnimatePresence>
          {appSwitcherOpen && !sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1.5 flex flex-col gap-0.5">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors no-drag',
                      selectedApp?.id === app.id
                        ? 'bg-purple/20 text-purple-light'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    )}
                  >
                    {app.name}
                  </button>
                ))}
                <button
                  onClick={() => { navigate('/apps/new'); setAppSwitcherOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-cyan hover:bg-cyan/5 transition-colors no-drag"
                >
                  <Plus className="w-3 h-3" /> New Application
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {/* Dashboard */}
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={sidebarCollapsed} end />

        {/* App-specific pages */}
        {selectedApp && APP_NAV.map((item) => {
          const to = typeof item.to === 'function' ? item.to(selectedApp.id) : item.to
          const isManageApps = to === '/apps'
          return (
            <SidebarLink key={item.label} to={to} icon={item.icon} label={item.label} collapsed={sidebarCollapsed} end={isManageApps} />
          )
        })}


        {!selectedApp && !sidebarCollapsed && (
          <div className="px-3 py-3 mt-2">
            <p className="text-[11px] text-text-muted text-center">Select or create an app to manage its settings</p>
          </div>
        )}

        {/* Global account links — always visible */}
        <div className="mt-2 pt-2 border-t border-border-default/50 space-y-0.5">
          {!sidebarCollapsed && (
            <p className="px-2.5 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Account</p>
          )}
          <SidebarLink to="/profile"  icon={UserCircle}         label="Profile"        collapsed={sidebarCollapsed} end />
          <SidebarLink to="/settings" icon={SlidersHorizontal}  label="Settings"       collapsed={sidebarCollapsed} end />
          <SidebarLink to="/billing"  icon={Wallet}             label="Billing"        collapsed={sidebarCollapsed} end />
          <SidebarLink to="/plans"    icon={Sparkles}           label="Manage Plans"   collapsed={sidebarCollapsed} end />
        </div>
      </nav>

      {/* User profile */}
      <div className="px-2 py-2 border-t border-border-default shrink-0">
        <div className={clsx('flex items-center gap-2.5 p-2 rounded-xl', !sidebarCollapsed && 'justify-between')}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                : user?.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{user?.username}</p>
                <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button onClick={handleLogout} className="p-1.5 rounded-lg text-text-muted hover:text-rose transition-colors no-drag" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}

function SidebarLink({ to, icon: Icon, label, collapsed, end }: {
  to: string; icon: React.ElementType; label: string; collapsed: boolean; end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all duration-150 no-drag group',
          isActive
            ? 'bg-purple/20 text-purple-light border border-purple/25'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-purple-light' : 'text-text-muted group-hover:text-text-primary')} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="font-medium truncate text-[13px]"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  )
}
