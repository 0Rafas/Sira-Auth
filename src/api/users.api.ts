import api from './client'
import type { ApiResponse, AppUser, PaginatedResponse } from '@/types'

export const usersApi = {
  getAll: async (appId: string, page = 1, limit = 50) => {
    const res = await api.get<PaginatedResponse<AppUser>>(
      `/dashboard/apps/${appId}/users`,
      { params: { page, limit } }
    )
    return res.data
  },

  ban: async (appId: string, userId: string, reason?: string) => {
    const res = await api.post<ApiResponse<AppUser>>(
      `/dashboard/apps/${appId}/users/${userId}/ban`,
      { reason }
    )
    return res.data
  },

  resetHwid: async (appId: string, userId: string) => {
    const res = await api.post<ApiResponse>(
      `/dashboard/apps/${appId}/users/${userId}/reset-hwid`
    )
    return res.data
  },

  delete: async (appId: string, userId: string) => {
    const res = await api.delete<ApiResponse>(
      `/dashboard/apps/${appId}/users/${userId}`
    )
    return res.data
  },
}
