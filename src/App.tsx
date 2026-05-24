import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'

import Toaster from '@/components/ui/Toast'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import { FullPageSpinner } from '@/components/ui/Spinner'

// ── Eager-loaded pages ─────────────────────────────────────
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import Dashboard from '@/pages/Dashboard'

// ── Lazy-loaded pages ──────────────────────────────────────
const Apps          = lazy(() => import('@/pages/Apps'))
const AppDetail     = lazy(() => import('@/pages/Apps/AppDetail'))
const Licenses      = lazy(() => import('@/pages/Licenses'))
const Users         = lazy(() => import('@/pages/Users'))
const Sessions      = lazy(() => import('@/pages/Sessions'))
const Tokens        = lazy(() => import('@/pages/Tokens'))
const Subscriptions = lazy(() => import('@/pages/Subscriptions'))
const Webhooks      = lazy(() => import('@/pages/Webhooks'))
const Files         = lazy(() => import('@/pages/Files'))
const Variables     = lazy(() => import('@/pages/Variables'))
const Rules         = lazy(() => import('@/pages/Rules'))
const Chats         = lazy(() => import('@/pages/Chats'))
const EventLogs     = lazy(() => import('@/pages/EventLogs'))
const AppSettings   = lazy(() => import('@/pages/AppSettings'))
const Profile       = lazy(() => import('@/pages/Profile'))
const UserSettings  = lazy(() => import('@/pages/UserSettings'))
const ManagePlans   = lazy(() => import('@/pages/ManagePlans'))
const Billing       = lazy(() => import('@/pages/Billing'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 3 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Suspense fallback={<FullPageSpinner />}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* ── Public ──────────────────────────────── */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ── Protected ───────────────────────────── */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile"   element={<Profile />} />
                <Route path="settings"  element={<UserSettings />} />
                <Route path="plans"     element={<ManagePlans />} />
                <Route path="billing"  element={<Billing />} />
                <Route path="apps" element={<Apps />} />
                <Route path="apps/new" element={<AppDetail isNew />} />
                <Route path="apps/:id" element={<Outlet />}>
                  <Route index element={<Navigate to="licenses" replace />} />
                  <Route path="licenses"     element={<Licenses />} />
                  <Route path="users"        element={<Users />} />
                  <Route path="sessions"     element={<Sessions />} />
                  <Route path="tokens"       element={<Tokens />} />
                  <Route path="subscriptions" element={<Subscriptions />} />
                  <Route path="webhooks"     element={<Webhooks />} />
                  <Route path="files"        element={<Files />} />
                  <Route path="variables"    element={<Variables />} />
                  <Route path="rules"        element={<Rules />} />
                  <Route path="chats"        element={<Chats />} />
                  <Route path="event-logs"   element={<EventLogs />} />
                  <Route path="settings"     element={<AppSettings />} />
                </Route>
              </Route>

              {/* ── Fallback ────────────────────────────── */}  
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <Toaster />
      </HashRouter>
    </QueryClientProvider>
  )
}
