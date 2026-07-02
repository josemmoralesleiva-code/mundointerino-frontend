import adminRepository from '../../../infrastructure/repositories/admin.repository'
import type { AdminUpdateUserRequest } from '../../../infrastructure/dto/admin.dto'
import type { User } from '../../../domain/models'

export const updateAdminUsuarioUseCase = async (
  id: string,
  data: AdminUpdateUserRequest
): Promise<User> => {
  return adminRepository.updateUsuario(id, data)
}
