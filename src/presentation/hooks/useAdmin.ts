import { useState, useCallback } from 'react'
import {
  getAdminStatsUseCase,
  getAdminUsuariosUseCase,
  updateAdminUsuarioUseCase,
  impersonateUserUseCase,
} from '../../application/useCases/admin'
import type { AdminStats, AdminUsuariosResponse, ImpersonateResponse } from '../../infrastructure/dto/admin.dto'

export function useAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [usuariosPage, setUsuariosPage] = useState<AdminUsuariosResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAdminStatsUseCase()
      setStats(data)
      setError('')
      return data
    } catch (err) {
      console.error('fetchStats error:', err)
      setError('No se pudieron cargar las estadísticas')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsuarios = useCallback(async (params?: {
    pagina?: number
    limite?: number
    filtro?: string
    search?: string
  }) => {
    setLoading(true)
    try {
      const data = await getAdminUsuariosUseCase(params)
      setUsuariosPage(data)
      setError('')
      return data
    } catch (err) {
      console.error('fetchUsuarios error:', err)
      setError('No se pudieron cargar los usuarios')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUsuario = useCallback(async (id: string, data: {
    rol?: string
    verificacionEstado?: string
    motivoRechazo?: string
  }) => {
    return updateAdminUsuarioUseCase(id, data)
  }, [])

  const impersonate = useCallback(async (userId: string): Promise<ImpersonateResponse> => {
    const res = await impersonateUserUseCase(userId)
    return res
  }, [])

  return {
    stats,
    usuariosPage,
    loading,
    error,
    setError,
    fetchStats,
    fetchUsuarios,
    updateUsuario,
    impersonate,
  }
}
