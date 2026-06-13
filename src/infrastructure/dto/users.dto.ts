import type { User } from '../../domain/models'

export interface UsersListResponse extends Array<User> {}

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
