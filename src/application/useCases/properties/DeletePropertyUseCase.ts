import propertiesRepository from '../../../infrastructure/repositories/properties.repository'

export const deletePropertyUseCase = async (id: string): Promise<void> => {
  await propertiesRepository.delete(id)
}
