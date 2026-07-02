import anunciosRepository from '../../../infrastructure/repositories/anuncios.repository'
import type { CreateAnuncioRequest } from '../../../infrastructure/dto/anuncios.dto'
import type { Anuncio } from '../../../domain/models/Anuncio'

export const createAnuncioUseCase = async (data: CreateAnuncioRequest): Promise<Anuncio> => {
  return anunciosRepository.create(data)
}
