import api from './client'
import type { EventLog, PaginatedResponse } from '@/types'

export const eventLogsApi = {
  getAll: async (appId: string, page = 1, limit = 50) => {
    const res = await api.get<PaginatedResponse<EventLog>>(
      `/dashboard/apps/${appId}/event-logs`,
      { params: { page, limit } }
    )
    return res.data
  },
}
