import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { ReenviarVerificacionResponse } from '../../../infrastructure/dto/auth.dto'

export const resendVerificationUseCase = async (email: string): Promise<ReenviarVerificacionResponse> => {
  return authRepository.resendVerification(email)
}
