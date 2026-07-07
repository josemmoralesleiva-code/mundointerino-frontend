export interface City {
  nombre: string
  slug: string
  provincia: string
  provinciaSlug?: string
  comunidad: string
  comunidadSlug?: string
  lat?: number
  lng?: number
}

export interface Comunidad {
  nombre: string
  slug: string
}

export interface Provincia {
  nombre: string
  slug: string
  comunidad: string
}