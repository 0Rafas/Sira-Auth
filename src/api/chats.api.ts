import api from './client'
import type { ApiResponse, ChatMessage } from '@/types'

export interface Channel {
  id: string
  appId: string
  name: string
  isDefault: boolean
  createdAt: string
}

export const chatsApi = {
  getChannels: async (appId: string) => {
    const res = await api.get<ApiResponse<Channel[]>>(`/dashboard/apps/${appId}/channels`)
    return res.data
  },

  getMessages: async (appId: string, channelId: string) => {
    const res = await api.get<ApiResponse<ChatMessage[]>>(
      `/dashboard/apps/${appId}/channels/${channelId}/messages`
    )
    return res.data
  },

  sendMessage: async (appId: string, channelId: string, content: string) => {
    const res = await api.post<ApiResponse<{ id: string }>>(
      `/dashboard/apps/${appId}/channels/${channelId}/messages`,
      { content }
    )
    return res.data
  },
}
