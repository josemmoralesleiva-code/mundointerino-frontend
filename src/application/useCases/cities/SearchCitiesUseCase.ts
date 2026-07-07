import citiesRepository from '../../../infrastructure/repositories/cities.repository'
import type { CitySearchParams } from '../../../infrastructure/dto/cities.dto'
import type { City } from '../../../domain/models/City'

export const searchCitiesUseCase = async (params: CitySearchParams = {}, signal?: AbortSignal): Promise<City[]> => {
  return citiesRepository.search(params, signal)
}