import propertiesRepository from '../../../infrastructure/repositories/properties.repository'
import type { Property } from '../../../domain/models'

export const toggleAvailabilityUseCase = async (id: string): Promise<Property> => {
  return propertiesRepository.toggleAvailability(id)
}
