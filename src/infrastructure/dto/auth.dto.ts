export interface AuthUser {
  id: string
  nombre: string
  email: string
  rol: string
  telefono: string
  verificacionEstado: string
  administracion: string | null
  emailVerificado?: boolean
  motivoRechazo?: string
  tipoDocumento?: string | null
  urlDocumento?: string | null
  verificationConfidence?: number
  verificationNotes?: string
  verificationDate?: string
  verificationType?: string
}

export interface AuthResponse {
  usuario: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nombre: string
  email: string
  password: string
  rol: string
  telefono: string
}

export interface RegisterResponse {
  mensaje: string
  requiereVerificacionEmail: boolean
}

export type VerifyEmailResponse = AuthResponse

export interface ReenviarVerificacionResponse {
  mensaje: string
}

export interface PasswordRule {
  regex: string
  label: string
}

export interface PasswordRequirementItem {
  clave: string
  etiqueta: string
  regex: string
}

export interface PasswordRequirementsResponse {
  requisitos: PasswordRequirementItem[]
  fortalezaMinima: number
}
