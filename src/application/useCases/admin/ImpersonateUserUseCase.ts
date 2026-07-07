import adminRepository from '../../../infrastructure/repositories/admin.repository'
import type { ImpersonateResponse } from '../../../infrastructure/dto/admin.dto'

export const impersonateUserUseCase = async (userId: string): Promise<ImpersonateResponse> => {
  return adminRepository.impersonate(userId)
}
