import propertiesRepository from '../../../infrastructure/repositories/properties.repository'
import type { Property } from '../../../domain/models'

export const getMyPropertiesUseCase = async (): Promise<Property[]> => {
  return propertiesRepository.getMyProperties()
}
