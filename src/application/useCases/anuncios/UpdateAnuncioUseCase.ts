import anunciosRepository from '../../../infrastructure/repositories/anuncios.repository'
import type { UpdateAnuncioRequest } from '../../../infrastructure/dto/anuncios.dto'
import type { Anuncio } from '../../../domain/models/Anuncio'

export const updateAnuncioUseCase = async (
  id: string,
  data: UpdateAnuncioRequest
): Promise<Anuncio> => {
  return anunciosRepository.update(id, data)
}
