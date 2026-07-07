import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { LoginRequest, AuthUser } from '../../../infrastructure/dto/auth.dto'

export const loginUseCase = async (data: LoginRequest): Promise<AuthUser> => {
  return authRepository.login(data)
}
