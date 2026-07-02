export interface AuthUser {
  id: string
  nombre: string
  email: string
  rol: string
  telefono: string
  verificacionEstado: string
  administracion: string | null
}

export interface AuthResponse {
  token: string
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
  verificacionEstado: string
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
