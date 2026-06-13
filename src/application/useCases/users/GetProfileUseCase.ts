import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { User } from '../../../domain/models'

export const getProfileUseCase = async (): Promise<User> => {
  return usersRepository.getProfile()
}
