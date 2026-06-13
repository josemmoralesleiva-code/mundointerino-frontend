import propertiesRepository from '../../../infrastructure/repositories/properties.repository'
import type { Property } from '../../../domain/models'

export const getPropertyByIdUseCase = async (id: string): Promise<Property> => {
  return propertiesRepository.getById(id)
}
