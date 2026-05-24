import api from './client'
import type { ApiResponse, Subscription } from '@/types'

export interface CreateSubscriptionPayload {
  name: string
  level: number
  price: number
  duration: number
  description?: string
}

export const subscriptionsApi = {
  getAll: async (appId: string) => {
    const res = await api.get<ApiResponse<Subscription[]>>(`/dashboard/apps/${appId}/subscriptions`)
    return res.data
  },

  create: async (appId: string, payload: CreateSubscriptionPayload) => {
    const res = await api.post<ApiResponse<Subscription>>(
      `/dashboard/apps/${appId}/subscriptions`,
      payload
    )
    return res.data
  },

  delete: async (appId: string, subId: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${appId}/subscriptions/${subId}`)
    return res.data
  },
}
