import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { User } from '../../../domain/models'

export const verifyTeacherUseCase = async (formData: FormData): Promise<User> => {
  return usersRepository.sendTeacherVerification(formData)
}
