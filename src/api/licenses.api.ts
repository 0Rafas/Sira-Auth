import api from './client'
import type { ApiResponse, License, PaginatedResponse } from '@/types'

export interface CreateLicensePayload {
  appId: string
  amount: number
  level?: number
  duration?: number // days, -1 = lifetime
  maxUses?: number
  note?: string
}

export const licensesApi = {
  getAll: async (appId: string, page = 1, limit = 50) => {
    const res = await api.get<PaginatedResponse<License>>(
      `/dashboard/apps/${appId}/licenses`,
      { params: { page, limit } }
    )
    return res.data
  },

  create: async (payload: CreateLicensePayload) => {
    const res = await api.post<ApiResponse<License[]>>(
      `/dashboard/apps/${payload.appId}/licenses`,
      payload
    )
    return res.data
  },

  delete: async (appId: string, licenseId: string) => {
    const res = await api.delete<ApiResponse>(
      `/dashboard/apps/${appId}/licenses/${licenseId}`
    )
    return res.data
  },

  ban: async (appId: string, licenseId: string) => {
    const res = await api.post<ApiResponse<License>>(
      `/dashboard/apps/${appId}/licenses/${licenseId}/ban`
    )
    return res.data
  },
}
