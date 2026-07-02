import authRepository from '../../../infrastructure/repositories/auth.repository'
import type { PasswordRequirementsResponse } from '../../../infrastructure/dto/auth.dto'

export const getPasswordRequirementsUseCase = async (): Promise<PasswordRequirementsResponse> => {
  return authRepository.getPasswordRequirements()
}
