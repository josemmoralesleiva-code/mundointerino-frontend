import api from '../http/axiosClient'
import type { User } from '../../domain/models'
import type { UpdateProfileRequest, ChangePasswordRequest, VerifyUserRequest, UsersListResponse } from '../dto/users.dto'

const usersRepository = {
  async getProfile(): Promise<User> {
    const res = await api.get<User>('/api/usuarios/me')
    return res.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const res = await api.put<User>('/api/usuarios/me', data)
    return res.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.put('/api/usuarios/me/password', data)
  },

  async getAll(): Promise<UsersListResponse> {
    const res = await api.get<UsersListResponse>('/api/usuarios')
    return res.data
  },

  async verifyUser(id: string, data: VerifyUserRequest): Promise<User> {
    const res = await api.patch<User>(`/api/usuarios/${id}/verificar`, data)
    return res.data
  },

  async sendTeacherVerification(formData: FormData): Promise<User> {
    const res = await api.post<User>('/api/usuarios/verificacion-docente', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

export default usersRepository
