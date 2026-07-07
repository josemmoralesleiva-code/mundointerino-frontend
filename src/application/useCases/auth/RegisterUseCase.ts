import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { RegisterRequest, RegisterResponse } from '../../../infrastructure/dto/auth.dto'

export const registerUseCase = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return authRepository.register(data)
}
