import { useState, useCallback } from 'react'
import {
  getProfileUseCase,
  updateProfileUseCase,
  changePasswordUseCase,
  verifyTeacherUseCase,
  getUsersUseCase,
  verifyUserUseCase,
  reVerifyUserUseCase,
  deleteDocumentUseCase,
} from '../../application/useCases/users'
import type { User } from '../../domain/models'
import type { UpdateProfileRequest, ChangePasswordRequest, VerifyUserRequest } from '../../infrastructure/dto/users.dto'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProfileUseCase()
      setProfile(data)
      setError('')
      return data
    } catch {
      setError('Could not load profile')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    setLoading(true)
    setError('')
    try {
      const updated = await updateProfileUseCase(data)
      setProfile(updated)
      return updated
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    setLoading(true)
    setError('')
    try {
      await changePasswordUseCase(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not change password')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyTeacher = useCallback(async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      return await verifyTeacherUseCase(formData)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getUsersUseCase()
      setUsers(data)
      setError('')
    } catch {
      setError('Could not load users')
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyUser = useCallback(async (id: string, data: VerifyUserRequest) => {
    const updated = await verifyUserUseCase(id, data)
    setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)))
    return updated
  }, [])

  const reVerifyUser = useCallback(async (id: string) => {
    const updated = await reVerifyUserUseCase(id)
    setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)))
    return updated
  }, [])

  const deleteDocument = useCallback(async () => {
    await deleteDocumentUseCase()
  }, [])

  return {
    users,
    profile,
    loading,
    error,
    setProfile,
    setUsers,
    setError,
    fetchProfile,
    updateProfile,
    changePassword,
    verifyTeacher,
    fetchAll,
    verifyUser,
    reVerifyUser,
    deleteDocument,
  }
}
