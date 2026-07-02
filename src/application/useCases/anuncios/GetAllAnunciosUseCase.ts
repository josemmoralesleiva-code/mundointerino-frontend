import anunciosRepository from '../../../infrastructure/repositories/anuncios.repository'
import type { AnunciosResponse } from '../../../infrastructure/dto/anuncios.dto'

export const getAllAnunciosUseCase = async (params?: {
  administracion?: string
  tipo?: string
  pagina?: number
  limite?: number
}): Promise<AnunciosResponse> => {
  return anunciosRepository.getAll(params)
}
