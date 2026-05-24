import api from './client'
import type { ApiResponse, Session, PaginatedResponse } from '@/types'

export const sessionsApi = {
  getAll: async (appId: string, page = 1, limit = 50) => {
    const res = await api.get<PaginatedResponse<Session>>(
      `/dashboard/apps/${appId}/sessions`,
      { params: { page, limit } }
    )
    return res.data
  },

  kill: async (appId: string, sessionId: string) => {
    const res = await api.delete<ApiResponse>(
      `/dashboard/apps/${appId}/sessions/${sessionId}`
    )
    return res.data
  },

  killAll: async (appId: string) => {
    const res = await api.post<ApiResponse>(`/dashboard/apps/${appId}/sessions/kill-all`)
    return res.data
  },
}
