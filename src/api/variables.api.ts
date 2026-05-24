import api from './client'
import type { ApiResponse, Variable } from '@/types'

export interface UpsertVariablePayload {
  name: string
  value: string
  isSecret?: boolean
  userId?: string
}

export const variablesApi = {
  getAll: async (appId: string) => {
    const res = await api.get<ApiResponse<Variable[]>>(`/dashboard/apps/${appId}/variables`)
    return res.data
  },

  upsert: async (appId: string, payload: UpsertVariablePayload) => {
    const res = await api.post<ApiResponse<Variable>>(
      `/dashboard/apps/${appId}/variables`,
      payload
    )
    return res.data
  },

  delete: async (appId: string, varId: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${appId}/variables/${varId}`)
    return res.data
  },
}
