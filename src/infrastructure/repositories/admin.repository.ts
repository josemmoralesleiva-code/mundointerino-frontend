import api from '../http/axiosClient'
import type { AdminStats, AdminUsuariosResponse, AdminUpdateUserRequest } from '../dto/admin.dto'
import type { AuthResponse } from '../dto/auth.dto'
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

  async impersonate(userId: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(`/admin/usuarios/${userId}/impersonate`)
    return res.data
  },
}

export default adminRepository
