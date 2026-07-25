import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor: attach JWT ─────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cv_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle 401, 403, normalize errors ──────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ title?: string; detail?: string; status?: number }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = typeof window !== 'undefined' ? localStorage.getItem('cv_refresh') : null

      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh })
          localStorage.setItem('cv_token', data.token)
          originalRequest.headers.Authorization = `Bearer ${data.token}`
          return apiClient(originalRequest)
        } catch {
          localStorage.removeItem('cv_token')
          localStorage.removeItem('cv_refresh')
        }
      }

      // No refresh token — auto-get a new guest token and retry once
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/guest-token`)
        if (typeof window !== 'undefined') {
          localStorage.setItem('cv_token', data.token)
        }
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return apiClient(originalRequest)
      } catch {
        // Guest token fetch also failed — clear and let error propagate
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cv_token')
        }
      }
    }

    // Normalize error message
    const message =
      error.response?.data?.detail ||
      error.response?.data?.title ||
      error.message ||
      'An unexpected error occurred'

    const fullMessage = `${message} (Status: ${error.response?.status}, URL: ${error.config?.url})`;
    return Promise.reject(new Error(fullMessage))
  }
)

export default apiClient
