import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { RegisterRequest, AuthResponse } from '../../../infrastructure/dto/auth.dto'

export const registerUseCase = async (data: RegisterRequest): Promise<AuthResponse> => {
  return authRepository.register(data)
}
