import citiesRepository from '../../../infrastructure/repositories/cities.repository'
import type { City } from '../../../domain/models/City'

export const getCityUseCase = async (slug: string): Promise<City> => {
  return citiesRepository.getBySlug(slug)
}