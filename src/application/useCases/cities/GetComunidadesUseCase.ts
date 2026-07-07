import citiesRepository from '../../../infrastructure/repositories/cities.repository'
import type { Comunidad } from '../../../domain/models/City'

export const getComunidadesUseCase = async (): Promise<Comunidad[]> => {
  return citiesRepository.comunidades()
}