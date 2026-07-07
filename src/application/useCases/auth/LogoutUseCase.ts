import authRepository from '../../../infrastructure/repositories/auth.repository'

export const logoutUseCase = async (): Promise<void> => {
  await authRepository.logout()
}
