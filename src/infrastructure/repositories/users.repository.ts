import api from '../http/axiosClient'
import type { User } from '../../domain/models'
import type { UpdateProfileRequest, ChangePasswordRequest, VerifyUserRequest, UsersListResponse } from '../dto/users.dto'

const usersRepository = {
  async getProfile(): Promise<User> {
    const res = await api.get<User>('/usuarios/me')
    return res.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const res = await api.put<User>('/usuarios/me', data)
    return res.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.put('/usuarios/me/password', data)
  },

  async getAll(): Promise<UsersListResponse> {
    const res = await api.get<UsersListResponse>('/usuarios')
    return res.data
  },

  async verifyUser(id: string, data: VerifyUserRequest): Promise<User> {
    const res = await api.patch<User>(`/usuarios/${id}/verificar`, data)
    return res.data
  },

  async sendTeacherVerification(formData: FormData): Promise<User> {
    const res = await api.post<User>('/usuarios/verificacion-docente', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

export default usersRepository
