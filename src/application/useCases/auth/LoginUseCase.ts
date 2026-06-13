import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { LoginRequest, AuthResponse } from '../../../infrastructure/dto/auth.dto'

export const loginUseCase = async (data: LoginRequest): Promise<AuthResponse> => {
  return authRepository.login(data)
}
