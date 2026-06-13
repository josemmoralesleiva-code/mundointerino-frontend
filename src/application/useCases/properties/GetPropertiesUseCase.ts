import propertiesRepository from '../../../infrastructure/repositories/properties.repository'
import type { PropertyFilters } from '../../../infrastructure/dto/properties.dto'
import type { Property } from '../../../domain/models'

export const getPropertiesUseCase = async (filters: PropertyFilters = {}): Promise<Property[]> => {
  const response = await propertiesRepository.getAll(filters)
  return response.pisos
}
