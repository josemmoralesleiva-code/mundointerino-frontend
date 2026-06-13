import type { Property } from '../../domain/models'

export interface PropertiesResponse {
  pisos: Property[]
  total: number
  paginas: number
  paginaActual: number
}

export interface MessageResponse {
  mensaje: string
}

export interface PropertyFilters {
  comunidad?: string
  provincia?: string
  ciudad?: string
  tipo?: string
  fecha?: string
  precioMax?: string
  habitaciones?: string
  pagina?: string
  limite?: string
}

export interface PropertyFormData {
  titulo: string
  descripcion: string
  ciudad: string
  barrio: string
  precio: string
  precioDia: string
  tipoEstancia: string
  habitaciones: string
  banos: string
  metros: string
  planta: string
  fianza: string
  disponible: string
  servicios: string[]
  fotosActuales: string[]
}
