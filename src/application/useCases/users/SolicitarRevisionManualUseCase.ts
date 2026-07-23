import usersRepository from '../../../infrastructure/repositories/users.repository'
import type { User } from '../../../domain/models'

export const solicitarRevisionManualUseCase = async (): Promise<{ mensaje: string; usuario: User }> => {
  return usersRepository.solicitarRevisionManual()
}
