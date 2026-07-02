import { useState, useCallback } from 'react'
import {
  getAllAnunciosUseCase,
  createAnuncioUseCase,
  updateAnuncioUseCase,
  deleteAnuncioUseCase,
} from '../../application/useCases/anuncios'
import type { Anuncio } from '../../domain/models/Anuncio'
import type { AnunciosResponse, CreateAnuncioRequest, UpdateAnuncioRequest } from '../../infrastructure/dto/anuncios.dto'

export function useAnuncios() {
  const [anunciosPage, setAnunciosPage] = useState<AnunciosResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = useCallback(async (params?: {
    administracion?: string
    tipo?: string
    pagina?: number
    limite?: number
  }) => {
    setLoading(true)
    try {
      const data = await getAllAnunciosUseCase(params)
      setAnunciosPage(data)
      setError('')
      return data
    } catch {
      setError('No se pudieron cargar los anuncios')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (data: CreateAnuncioRequest) => {
    try {
      return await createAnuncioUseCase(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear anuncio')
      throw err
    }
  }, [])

  const update = useCallback(async (id: string, data: UpdateAnuncioRequest) => {
    try {
      return await updateAnuncioUseCase(id, data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar anuncio')
      throw err
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      await deleteAnuncioUseCase(id)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar anuncio')
      throw err
    }
  }, [])

  return {
    anunciosPage,
    loading,
    error,
    setError,
    fetchAll,
    create,
    update,
    remove,
  }
}
