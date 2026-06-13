import propertiesRepository from '../../../infrastructure/repositories/properties.repository'
import type { Property } from '../../../domain/models'

export const createPropertyUseCase = async (formData: FormData): Promise<Property> => {
  return propertiesRepository.create(formData)
}
