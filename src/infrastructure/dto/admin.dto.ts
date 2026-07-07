import type { User } from '../../domain/models'
import type { AuthUser } from './auth.dto'

export interface LastRegisteredUser {
  _id: string
  nombre: string
  email: string
  rol: string
  verificacionEstado: string
  createdAt: string
}

export interface AdminStats {
  usuarios: {
    total: number
    porRol: { docente: number; propietario: number; admin: number }
    pendientes: number
    verificados: number
    rechazados: number
    nuevosUltimoMes: number
  }
  ultimosRegistrados: LastRegisteredUser[]
}

export interface AdminUsuariosResponse {
  usuarios: User[]
  total: number
  pagina: number
  totalPaginas: number
}

export interface AdminUpdateUserRequest {
  rol?: string
  verificacionEstado?: string
  motivoRechazo?: string
}

export interface ImpersonateResponse {
  usuario: AuthUser
}
