import api from './client'
import type { ApiResponse, AppFile } from '@/types'

export const filesApi = {
  getAll: async (appId: string) => {
    const res = await api.get<ApiResponse<AppFile[]>>(`/dashboard/apps/${appId}/files`)
    return res.data
  },

  upload: async (appId: string, file: File, requiredLevel = 0) => {
    const form = new FormData()
    form.append('file', file)
    form.append('requiredLevel', String(requiredLevel))
    const res = await api.post<ApiResponse<AppFile>>(
      `/dashboard/apps/${appId}/files`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data
  },

  delete: async (appId: string, fileId: string) => {
    const res = await api.delete<ApiResponse>(`/dashboard/apps/${appId}/files/${fileId}`)
    return res.data
  },
}
