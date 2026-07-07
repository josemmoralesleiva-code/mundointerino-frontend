import type { City, Comunidad, Provincia } from '../../domain/models/City'

export interface RawCity {
  nombre: string
  slug: string
  provinciaNombre?: string
  provinciaSlug?: string
  comunidadNombre?: string
  comunidadSlug?: string
  provincia?: string
  comunidad?: string
  lat?: number
  lng?: number
}

export type CitiesResponse = RawCity[] | { ciudades: RawCity[] }

export interface ComunidadesResponse {
  comunidades: Comunidad[]
}

export interface ProvinciasResponse {
  provincias: Provincia[]
}

export interface CitySearchParams {
  q?: string
  comunidad?: string
  provincia?: string
  limit?: number
}

export function normalizeCity(raw: RawCity): City {
  return {
    nombre: raw.nombre,
    slug: raw.slug,
    provincia: raw.provincia ?? raw.provinciaNombre ?? '',
    provinciaSlug: raw.provinciaSlug,
    comunidad: raw.comunidad ?? raw.comunidadNombre ?? '',
    comunidadSlug: raw.comunidadSlug,
    lat: raw.lat,
    lng: raw.lng,
  }
}