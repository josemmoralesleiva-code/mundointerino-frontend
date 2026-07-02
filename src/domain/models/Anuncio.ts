export interface Anuncio {
  _id: string
  titulo: string
  descripcion: string
  administracion: string
  tipo: string
  url?: string
  activo: boolean
  destacado: boolean
  fechaExpiracion?: string
  createdAt: string
}
