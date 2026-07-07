import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { AuthUser } from '../../../infrastructure/dto/auth.dto'

export const meUseCase = async (): Promise<AuthUser> => {
  return authRepository.me()
}
