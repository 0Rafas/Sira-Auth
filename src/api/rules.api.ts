import api from './client'
import type { ApiResponse, Rule } from '@/types'

export interface CreateRulePayload {
  name: string
  type: string
  value: string
  action: 'block' | 'allow'
}

export const rulesApi = {
  getAll: async (appId: string) => {
    const res = await api.get<ApiResponse<Rule[]>>(`/dashboard/apps/${appId}/rules`)
    return res.data
  },

  create: async (appId: string, payload: CreateRulePayload) => {
    const res = await api.post<ApiResponse<Rule>>(`/dashboard/apps/${appId}/rules`, payload)
    return res.data
  },

  toggle: async (appId: string, ruleId: string) => {
    const res = await api.post<ApiResponse<{ enabled: boolean }>>(
      `/dashboard/apps/${appId}/rules/${ruleId}/toggle`
    )
    return res.data
  },

  delete: async (appId: string, ruleId: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${appId}/rules/${ruleId}`)
    return res.data
  },
}
