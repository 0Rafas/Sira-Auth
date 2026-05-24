import api from './client'
import type { ApiResponse, User } from '@/types'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface AuthData {
  user: User
  token: string
  refreshToken: string
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/login', payload)
    return res.data
  },

  register: async (payload: RegisterPayload) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/register', payload)
    return res.data
  },

  googleLogin: async (code: string) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/google', { code })
    return res.data
  },

  loginWithToken: async (token: string) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/token', { token })
    return res.data
  },

  logout: async () => {
    await api.post('/auth/logout')
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me')
    return res.data
  },

  updateMe: async (payload: { username?: string; email?: string; avatarUrl?: string }) => {
    const res = await api.put<ApiResponse<User>>('/auth/me', payload)
    return res.data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post<ApiResponse>('/auth/me/password', { currentPassword, newPassword })
    return res.data
  },

  refresh: async (refreshToken: string) => {
    const res = await api.post<ApiResponse<{ token: string; refreshToken: string }>>('/auth/refresh', { refreshToken })
    return res.data
  },
}
