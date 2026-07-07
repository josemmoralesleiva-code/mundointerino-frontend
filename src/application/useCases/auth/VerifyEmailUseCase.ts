import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { VerifyEmailResponse } from '../../../infrastructure/dto/auth.dto'

export const verifyEmailUseCase = async (token: string): Promise<VerifyEmailResponse> => {
  return authRepository.verifyEmail(token)
}
