import type { Anuncio } from '../../domain/models/Anuncio'

export interface AnunciosResponse {
  anuncios: Anuncio[]
  total: number
  pagina: number
  totalPaginas: number
}

export interface CreateAnuncioRequest {
  titulo: string
  descripcion: string
  administracion: string
  tipo: string
  url?: string
  activo?: boolean
  destacado?: boolean
  fechaExpiracion?: string
}

export interface UpdateAnuncioRequest {
  titulo?: string
  descripcion?: string
  administracion?: string
  tipo?: string
  url?: string
  activo?: boolean
  destacado?: boolean
  fechaExpiracion?: string
}
