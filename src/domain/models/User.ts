export type Role = 'docente' | 'propietario' | 'admin'

export type VerificationStatus = 'pendiente' | 'verificado' | 'rechazado'

export type Administration = 'educacion' | 'sanidad' | 'justicia' | 'otros'

export type DocumentType = 'nomina' | 'nombramiento' | 'credencial' | 'contrato' | 'certificado_servicios' | 'resolucion'

export interface User {
  _id: string
  nombre: string
  email: string
  rol: Role
  telefono: string
  verificacionEstado: VerificationStatus
  emailVerificado?: boolean
  motivoRechazo?: string
  tipoDocumento?: DocumentType | null
  administracion?: Administration | null
  urlDocumento?: string | null
  verificationConfidence?: number
  verificationNotes?: string
  verificationDate?: string
  verificationType?: string
  createdAt?: string
  updatedAt?: string
}
