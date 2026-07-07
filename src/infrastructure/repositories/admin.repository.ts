import api from '../http/axiosClient'
import type { AdminStats, AdminUsuariosResponse, AdminUpdateUserRequest, ImpersonateResponse } from '../dto/admin.dto'
import type { User } from '../../domain/models'

const adminRepository = {
  async getStats(): Promise<AdminStats> {
    const res = await api.get<AdminStats>('/admin/stats')
    return res.data
  },

  async getUsuarios(params?: {
    pagina?: number
    limite?: number
    filtro?: string
    search?: string
  }): Promise<AdminUsuariosResponse> {
    const res = await api.get<AdminUsuariosResponse>('/admin/usuarios', { params })
    return res.data
  },

  async updateUsuario(id: string, data: AdminUpdateUserRequest): Promise<User> {
    const res = await api.patch<User>(`/admin/usuarios/${id}`, data)
    return res.data
  },

  async impersonate(userId: string): Promise<ImpersonateResponse> {
    const res = await api.post<ImpersonateResponse>(`/admin/usuarios/${userId}/impersonate`)
    return res.data
  },

  async endImpersonation(): Promise<void> {
    await api.post('/admin/end-impersonation')
  },
}

export default adminRepository
