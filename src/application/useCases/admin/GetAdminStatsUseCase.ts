import adminRepository from '../../../infrastructure/repositories/admin.repository'
import type { AdminStats } from '../../../infrastructure/dto/admin.dto'

export const getAdminStatsUseCase = async (): Promise<AdminStats> => {
  return adminRepository.getStats()
}
