import api from './client'
import type { ApiResponse, Webhook } from '@/types'

export interface CreateWebhookPayload {
  url: string
  secret?: string
  events: string[]
}

export const webhooksApi = {
  getAll: async (appId: string) => {
    const res = await api.get<ApiResponse<Webhook[]>>(`/dashboard/apps/${appId}/webhooks`)
    return res.data
  },

  create: async (appId: string, payload: CreateWebhookPayload) => {
    const res = await api.post<ApiResponse<Webhook>>(`/dashboard/apps/${appId}/webhooks`, payload)
    return res.data
  },

  update: async (appId: string, webhookId: string, payload: Partial<CreateWebhookPayload> & { status?: string }) => {
    const res = await api.put<ApiResponse<Webhook>>(
      `/dashboard/apps/${appId}/webhooks/${webhookId}`,
      payload
    )
    return res.data
  },

  delete: async (appId: string, webhookId: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${appId}/webhooks/${webhookId}`)
    return res.data
  },

  test: async (appId: string, webhookId: string) => {
    const res = await api.post<ApiResponse<{ statusCode: number }>>(
      `/dashboard/apps/${appId}/webhooks/${webhookId}/test`
    )
    return res.data
  },
}
