import { useState, useEffect, useCallback } from 'react'
import { searchCitiesUseCase, getComunidadesUseCase, getProvinciasUseCase, getCityUseCase } from '../../application/useCases/cities'
import type { City, Comunidad, Provincia } from '../../domain/models/City'

export function useCitySuggestions(
  q: string,
  opts: { limit?: number; minChars?: number; comunidad?: string; provincia?: string } = {},
) {
  const limit = opts.limit ?? 15
  const minChars = opts.minChars ?? 2
  const comunidad = opts.comunidad
  const provincia = opts.provincia
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const query = q.trim()
    if (query.length < minChars) {
      setSuggestions([])
      setLoading(false)
      setError('')
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError('')

    const timeout = setTimeout(async () => {
      try {
        const data = await searchCitiesUseCase(
          { q: query, limit, comunidad, provincia },
          controller.signal,
        )
        setSuggestions(data)
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return
        setError('No se pudieron cargar las ciudades')
        setSuggestions([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [q, limit, minChars, comunidad, provincia])

  return { suggestions, loading, error }
}

export function useComunidades(enabled = true) {
  const [comunidades, setComunidades] = useState<Comunidad[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError('')
    try {
      const data = await getComunidadesUseCase()
      setComunidades(data)
    } catch {
      setError('No se pudieron cargar las comunidades')
      setComunidades([])
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { comunidades, loading, error, refetch }
}

export function useProvincias(comunidad: string) {
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!comunidad) {
      setProvincias([])
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getProvinciasUseCase(comunidad)
      .then((data) => setProvincias(data))
      .catch(() => {
        setProvincias([])
        setError('No se pudieron cargar las provincias')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [comunidad])

  return { provincias, loading, error }
}

export function useCity(slug: string) {
  const [city, setCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) {
      setCity(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getCityUseCase(slug)
      .then((data) => setCity(data))
      .catch(() => {
        setCity(null)
        setError('No se pudo cargar la ciudad')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [slug])

  return { city, loading, error }
}