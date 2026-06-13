import api from '../http/axiosClient'
import type { Property } from '../../domain/models'
import type { PropertiesResponse, PropertyFilters } from '../dto/properties.dto'

const propertiesRepository = {
  async getAll(filters: PropertyFilters = {}): Promise<PropertiesResponse> {
    const cleanParams: Record<string, string> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value
      }
    })
    const res = await api.get<PropertiesResponse>('/pisos', { params: cleanParams })
    return res.data
  },

  async getById(id: string): Promise<Property> {
    const res = await api.get<Property>(`/pisos/${id}`)
    return res.data
  },

  async getMyProperties(): Promise<Property[]> {
    const res = await api.get<Property[]>('/pisos/mis-pisos')
    return res.data
  },

  async create(formData: FormData): Promise<Property> {
    const res = await api.post<Property>('/pisos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async update(id: string, formData: FormData): Promise<Property> {
    const res = await api.put<Property>(`/pisos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/pisos/${id}`)
  },

  async toggleAvailability(id: string): Promise<Property> {
    const res = await api.patch<Property>(`/pisos/${id}/disponibilidad`, {})
    return res.data
  },
}

export default propertiesRepository
