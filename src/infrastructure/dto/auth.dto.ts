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
