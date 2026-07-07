import api from '../http/axiosClient'
import type { City, Comunidad, Provincia } from '../../domain/models/City'
import {
  normalizeCity,
  type CitiesResponse,
  type ComunidadesResponse,
  type ProvinciasResponse,
  type CitySearchParams,
} from '../dto/cities.dto'

const citiesRepository = {
  async search(params: CitySearchParams = {}, signal?: AbortSignal): Promise<City[]> {
    const cleanParams: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value
      }
    })
    const res = await api.get<CitiesResponse>('/ciudades', {
      params: cleanParams,
      signal,
    })
    const data = res.data
    const raw = Array.isArray(data) ? data : (data.ciudades ?? [])
    return raw.map(normalizeCity)
  },

  async comunidades(): Promise<Comunidad[]> {
    const res = await api.get<ComunidadesResponse>('/comunidades')
    return res.data.comunidades
  },

  async provincias(comunidadSlug: string): Promise<Provincia[]> {
    const res = await api.get<ProvinciasResponse>('/provincias', {
      params: { comunidad: comunidadSlug },
    })
    return res.data.provincias
  },

  async getBySlug(slug: string): Promise<City> {
    const res = await api.get(`/ciudades/${slug}`)
    return normalizeCity(res.data)
  },
}

export default citiesRepository