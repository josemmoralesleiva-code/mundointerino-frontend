import propertiesRepository from '../../../infrastructure/repositories/properties.repository'
import type { Property } from '../../../domain/models'

export const updatePropertyUseCase = async (id: string, formData: FormData): Promise<Property> => {
  return propertiesRepository.update(id, formData)
}
