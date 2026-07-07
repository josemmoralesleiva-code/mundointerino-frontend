import { useState, useCallback } from 'react'
import {
  getPropertiesUseCase,
  getPropertyByIdUseCase,
  createPropertyUseCase,
  updatePropertyUseCase,
  deletePropertyUseCase,
  toggleAvailabilityUseCase,
  getMyPropertiesUseCase,
} from '../../application/useCases/properties'
import type { Property } from '../../domain/models'
import type { PropertyFilters } from '../../infrastructure/dto/properties.dto'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = useCallback(async (filters: PropertyFilters = {}) => {
    setLoading(true)
    try {
      const data = await getPropertiesUseCase(filters)
      setProperties(data)
      setError('')
    } catch (err) {
      setError('No se pudieron cargar los pisos. Inténtalo más tarde.')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchById = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const data = await getPropertyByIdUseCase(id)
      setProperty(data)
      setError('')
      return data
    } catch {
      setError('No se pudo encontrar el piso solicitado.')
      setProperty(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMyProperties = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyPropertiesUseCase()
      setProperties(data)
      setError('')
    } catch {
      setError('No se pudieron cargar tus pisos. Inténtalo más tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      return await createPropertyUseCase(formData)
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo publicar el piso. Inténtalo más tarde.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const update = useCallback(async (id: string, formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      return await updatePropertyUseCase(id, formData)
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo actualizar el piso. Inténtalo más tarde.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    await deletePropertyUseCase(id)
    setProperties((prev) => prev.filter((p) => p._id !== id))
  }, [])

  const toggleAvailability = useCallback(async (id: string) => {
    const updated = await toggleAvailabilityUseCase(id)
    setProperties((prev) => prev.map((p) => (p._id === id ? updated : p)))
    return updated
  }, [])

  return {
    properties,
    property,
    loading,
    error,
    setProperties,
    setError,
    fetchAll,
    fetchById,
    fetchMyProperties,
    create,
    update,
    remove,
    toggleAvailability,
  }
}
