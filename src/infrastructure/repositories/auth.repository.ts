import api from '../http/axiosClient'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../dto/auth.dto'

const authRepository = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/registro', data)
    return res.data
  },
}

export default authRepository
