import api from './client'
import type { ApiResponse, Application, PaginatedResponse, DashboardStats } from '@/types'

export const appsApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Application[]>>('/dashboard/apps')
    return res.data
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Application>>(`/dashboard/apps/${id}`)
    return res.data
  },

  create: async (payload: { name: string; version: string }) => {
    const res = await api.post<ApiResponse<Application>>('/dashboard/apps', payload)
    return res.data
  },

  update: async (id: string, payload: Partial<Application>) => {
    const res = await api.put<ApiResponse<Application>>(`/dashboard/apps/${id}`, payload)
    return res.data
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${id}`)
    return res.data
  },

  pause: async (id: string) => {
    const res = await api.post<ApiResponse<Application>>(`/dashboard/apps/${id}/pause`)
    return res.data
  },

  refreshSecret: async (id: string) => {
    const res = await api.post<ApiResponse<{ secret: string }>>(`/dashboard/apps/${id}/refresh-secret`)
    return res.data
  },

  getStats: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    return res.data
  },
}
