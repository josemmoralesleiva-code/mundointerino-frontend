import api from '../http/axiosClient'
import type {
  AuthUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailResponse,
  ReenviarVerificacionResponse,
  PasswordRequirementsResponse,
} from '../dto/auth.dto'

const authRepository = {
  async login(data: LoginRequest): Promise<AuthUser> {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data.usuario
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const res = await api.post<RegisterResponse>('/auth/registro', data)
    return res.data
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const res = await api.get<VerifyEmailResponse>('/auth/verificar-email', {
      params: { token },
    })
    return res.data
  },

  async resendVerification(email: string): Promise<ReenviarVerificacionResponse> {
    const res = await api.post<ReenviarVerificacionResponse>('/auth/reenviar-verificacion', { email })
    return res.data
  },

  async me(): Promise<AuthUser> {
    const res = await api.get<AuthResponse>('/auth/me')
    return res.data.usuario
  },

  async refresh(): Promise<void> {
    await api.post('/auth/refresh')
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getPasswordRequirements(): Promise<PasswordRequirementsResponse> {
    const res = await api.get<PasswordRequirementsResponse>('/auth/password-requirements')
    return res.data
  },
}

export default authRepository
