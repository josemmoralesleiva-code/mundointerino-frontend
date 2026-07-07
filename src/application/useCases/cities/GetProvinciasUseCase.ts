import citiesRepository from '../../../infrastructure/repositories/cities.repository'
import type { Provincia } from '../../../domain/models/City'

export const getProvinciasUseCase = async (comunidadSlug: string): Promise<Provincia[]> => {
  return citiesRepository.provincias(comunidadSlug)
}