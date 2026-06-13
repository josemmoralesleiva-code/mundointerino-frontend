import usersRepository from '../../../infrastructure/repositories/users.repository'
import { storage } from '../../../infrastructure/storage/localStorage'
import type { UpdateProfileRequest } from '../../../infrastructure/dto/users.dto'
import type { User } from '../../../domain/models'

export const updateProfileUseCase = async (data: UpdateProfileRequest): Promise<User> => {
  const user = await usersRepository.updateProfile(data)
  const current = storage.getUser()
  if (current) {
    storage.updateUser({ ...current, nombre: user.nombre, email: user.email, telefono: user.telefono })
  }
  return user
}
