import usersRepository from '../../../infrastructure/repositories/users.repository'

export const deleteDocumentUseCase = async (): Promise<void> => {
  return usersRepository.deleteDocument()
}
