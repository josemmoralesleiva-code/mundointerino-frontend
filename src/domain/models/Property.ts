export type StayType = 'corta' | 'larga' | 'ambas'

export interface OwnerSummary {
  _id: string
  nombre: string
  telefono?: string
  email?: string
}

export interface Property {
  _id: string
  titulo: string
  descripcion?: string
  ciudad: string
  barrio?: string
  contacto?: string
  precio: number
  precioDia?: number
  fianza?: number
  habitaciones: number
  banos?: number
  metros?: number
  planta?: string
  tipoEstancia: StayType
  disponible?: string
  servicios: string[]
  fotos: string[]
  activo: boolean
  comunidad: string
  provincia: string
  propietario: string | OwnerSummary
  lat?: number
  lng?: number
  createdAt?: string
  updatedAt?: string
}
