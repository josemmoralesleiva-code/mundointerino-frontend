import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://api.mundointerino.com'

// El backend DEBE enviar `Access-Control-Allow-Credentials: true` y un Origin explícito (nunca `*`),
// de lo contrario el navegador no enviará ni aceptará las cookies httpOnly cross-origin.
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const refreshApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

type FailedQueueItem = {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  config: AxiosRequestConfig
}

let isRefreshing = false
let failedQueue: FailedQueueItem[] = []
const retried = new WeakSet<AxiosRequestConfig>()

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  return url.includes('/auth/login') || url.includes('/auth/refresh')
}

function triggerLogout(): void {
  window.dispatchEvent(new CustomEvent('auth:logout'))
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as AxiosRequestConfig | undefined
    const status = error?.response?.status

    if (isAuthEndpoint(originalRequest?.url)) {
      if (status === 401 && originalRequest?.url?.includes('/auth/refresh')) {
        triggerLogout()
      }
      return Promise.reject(error)
    }

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (retried.has(originalRequest)) {
      triggerLogout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest })
      }).then(() => {
        retried.add(originalRequest)
        return api(originalRequest)
      })
    }

    isRefreshing = true
    try {
      await refreshApi.post('/auth/refresh')
      failedQueue.forEach((item) => item.resolve(undefined))
      failedQueue = []
      retried.add(originalRequest)
      return api(originalRequest)
    } catch (refreshError) {
      failedQueue.forEach((item) => item.reject(refreshError))
      failedQueue = []
      triggerLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
