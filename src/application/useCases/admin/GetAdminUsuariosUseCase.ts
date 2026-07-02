import adminRepository from '../../../infrastructure/repositories/admin.repository'
import type { AdminUsuariosResponse } from '../../../infrastructure/dto/admin.dto'

export const getAdminUsuariosUseCase = async (params?: {
  pagina?: number
  limite?: number
  filtro?: string
  search?: string
}): Promise<AdminUsuariosResponse> => {
  return adminRepository.getUsuarios(params)
}
