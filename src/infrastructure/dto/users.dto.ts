import type { User } from '../../domain/models'

export type UsersListResponse = User[]

export interface UpdateProfileRequest {
  nombre: string
  email: string
  telefono?: string
}

export interface ChangePasswordRequest {
  passwordActual: string
  passwordNueva: string
}

export interface VerifyUserRequest {
  estado: string
  motivoRechazo?: string
}
