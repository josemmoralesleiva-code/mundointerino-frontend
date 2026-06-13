export type Role = 'docente' | 'propietario' | 'admin'

export type VerificationStatus = 'pendiente' | 'verificado' | 'rechazado'

export type Administration = 'educacion' | 'sanidad' | 'justicia' | 'otros'

export type DocumentType = 'nomina' | 'nombramiento' | 'credencial' | 'contrato'

export interface User {
  _id: string
  nombre: string
  email: string
  rol: Role
  telefono: string
  verificacionEstado: VerificationStatus
  motivoRechazo?: string
  tipoDocumento?: DocumentType | null
  administracion?: Administration | null
  urlDocumento?: string | null
  createdAt?: string
  updatedAt?: string
}
