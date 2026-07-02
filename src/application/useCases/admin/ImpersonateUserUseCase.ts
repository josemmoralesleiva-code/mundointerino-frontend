import adminRepository from '../../../infrastructure/repositories/admin.repository'
import type { AuthResponse } from '../../../infrastructure/dto/auth.dto'

export const impersonateUserUseCase = async (userId: string): Promise<AuthResponse> => {
  return adminRepository.impersonate(userId)
}
