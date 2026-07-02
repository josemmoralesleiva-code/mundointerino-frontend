import anunciosRepository from '../../../infrastructure/repositories/anuncios.repository'

export const deleteAnuncioUseCase = async (id: string): Promise<void> => {
  return anunciosRepository.remove(id)
}
