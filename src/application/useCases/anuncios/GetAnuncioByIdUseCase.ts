import anunciosRepository from '../../../infrastructure/repositories/anuncios.repository'
import type { Anuncio } from '../../../domain/models/Anuncio'

export const getAnuncioByIdUseCase = async (id: string): Promise<Anuncio> => {
  return anunciosRepository.getById(id)
}
