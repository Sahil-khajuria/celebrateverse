import apiClient from './api'
import { PageFormData } from '@/store/slices/builderSlice'

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; displayName: string }) =>
    apiClient.post('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data).then((r) => r.data),

  guestToken: () =>
    apiClient.post('/auth/guest-token').then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),
}

// ─── Pages ────────────────────────────────────────────────────
export const pagesApi = {
  create: (data: Partial<PageFormData>) =>
    apiClient.post('/pages', data).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get(`/pages/${slug}`).then((r) => r.data),

  update: (id: number, data: Partial<PageFormData>) =>
    apiClient.put(`/pages/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/pages/${id}`).then((r) => r.data),

  publish: (id: number) =>
    apiClient.post(`/pages/${id}/publish`).then((r) => r.data),

  getQrCode: (id: number): Promise<Blob> =>
    apiClient.get(`/pages/${id}/qrcode`, { responseType: 'blob' }).then((r) => r.data),

  setPassword: (id: number, password: string) =>
    apiClient.post(`/pages/${id}/password`, { password }).then((r) => r.data),

  verifyPassword: (slug: string, password: string) =>
    apiClient.post(`/pages/${slug}/verify-password`, { password }).then((r) => r.data),

  getDashboard: (): Promise<DashboardPage[]> =>
    apiClient.get('/dashboard/pages').then((r) => r.data),
}

// ─── Media ────────────────────────────────────────────────────
export const mediaApi = {
  upload: (pageId: number, file: File, type: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    return apiClient.post(`/pages/${pageId}/media`, form, {
      headers: {
        'Content-Type': undefined
      }
    }).then((r) => r.data)
  },

  delete: (assetId: number) =>
    apiClient.delete(`/media/${assetId}`).then((r) => r.data),

  reorder: (pageId: number, assetIds: number[]) =>
    apiClient.put(`/pages/${pageId}/media/reorder`, { assetIds }).then((r) => r.data),
}

// ─── Wishes ───────────────────────────────────────────────────
export const wishesApi = {
  getBySlug: (slug: string) =>
    apiClient.get(`/pages/${slug}/wishes`).then((r) => r.data),

  create: (slug: string, data: { authorName?: string; message: string; reactionEmoji?: string }) =>
    apiClient.post(`/pages/${slug}/wishes`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/wishes/${id}`).then((r) => r.data),
}

// ─── Engagement ───────────────────────────────────────────────
export const engagementApi = {
  logEvent: (slug: string, eventType: string) =>
    apiClient.post(`/pages/${slug}/events`, { eventType }),

  getAnalytics: (id: number) =>
    apiClient.get(`/pages/${id}/analytics`).then((r) => r.data),
}

// ─── AI ───────────────────────────────────────────────────────
export const aiApi = {
  generateMessage: (data: { recipientName?: string; relationship?: string; tone?: string }) =>
    apiClient.post('/ai/generate-message', data).then((r) => r.data),

  generateAvatar: (styleSeed?: string) =>
    apiClient.post('/ai/generate-avatar', { styleSeed }).then((r) => r.data),
}

// ─── Types ────────────────────────────────────────────────────
export interface DashboardPage {
  id: number
  slug: string
  recipientName: string | null
  theme: string
  viewCount: number
  wishCount: number
  createdAt: string
  shareUrl: string
}
