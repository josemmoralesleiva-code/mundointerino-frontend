import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { User } from '../../../domain/models'

export const getUsersUseCase = async (): Promise<User[]> => {
  return usersRepository.getAll()
}
