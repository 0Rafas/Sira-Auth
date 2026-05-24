import api from './client'
import type { ApiResponse, Token } from '@/types'

export interface CreateTokenPayload {
  name: string
  permissions: string[]
}

export const tokensApi = {
  getAll: async (appId: string) => {
    const res = await api.get<ApiResponse<Token[]>>(`/dashboard/apps/${appId}/tokens`)
    return res.data
  },

  create: async (appId: string, payload: CreateTokenPayload) => {
    const res = await api.post<ApiResponse<Token>>(`/dashboard/apps/${appId}/tokens`, payload)
    return res.data
  },

  delete: async (appId: string, tokenId: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${appId}/tokens/${tokenId}`)
    return res.data
  },
}
