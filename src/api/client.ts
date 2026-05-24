import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT token ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sira_auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: handle 401 globally ─────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sira_auth_token')
      localStorage.removeItem('sira_auth_user')
      window.location.hash = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
