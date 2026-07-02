import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { User } from '../../../domain/models'

export const reVerifyUserUseCase = async (id: string): Promise<User> => {
  return usersRepository.reVerifyUser(id)
}
