import { useState, useCallback } from 'react'
import {
  getAdminStatsUseCase,
  getAdminUsuariosUseCase,
  updateAdminUsuarioUseCase,
  impersonateUserUseCase,
} from '../../application/useCases/admin'
import type { AdminStats, AdminUsuariosResponse } from '../../infrastructure/dto/admin.dto'
import type { AuthResponse } from '../../infrastructure/dto/auth.dto'

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
    try {
      const updated = await updateAdminUsuarioUseCase(id, data)
      return updated
    } catch (err: any) {
      throw err
    }
  }, [])

  const impersonate = useCallback(async (userId: string): Promise<AuthResponse> => {
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
