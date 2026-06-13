import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { VerifyUserRequest } from '../../../infrastructure/dto/users.dto'
import type { User } from '../../../domain/models'

export const verifyUserUseCase = async (id: string, data: VerifyUserRequest): Promise<User> => {
  return usersRepository.verifyUser(id, data)
}
