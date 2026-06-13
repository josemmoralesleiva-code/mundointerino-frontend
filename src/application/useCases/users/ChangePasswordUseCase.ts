import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { ChangePasswordRequest } from '../../../infrastructure/dto/users.dto'

export const changePasswordUseCase = async (data: ChangePasswordRequest): Promise<void> => {
  await usersRepository.changePassword(data)
}
