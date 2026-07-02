import api from '../http/axiosClient'
import type { Anuncio } from '../../domain/models/Anuncio'
import type { AnunciosResponse, CreateAnuncioRequest, UpdateAnuncioRequest } from '../dto/anuncios.dto'

const anunciosRepository = {
  async getAll(params?: {
    administracion?: string
    tipo?: string
    pagina?: number
    limite?: number
  }): Promise<AnunciosResponse> {
    const res = await api.get<AnunciosResponse>('/anuncios', { params })
    return res.data
  },

  async getById(id: string): Promise<Anuncio> {
    const res = await api.get<Anuncio>(`/anuncios/${id}`)
    return res.data
  },

  async create(data: CreateAnuncioRequest): Promise<Anuncio> {
    const res = await api.post<Anuncio>('/anuncios', data)
    return res.data
  },

  async update(id: string, data: UpdateAnuncioRequest): Promise<Anuncio> {
    const res = await api.put<Anuncio>(`/anuncios/${id}`, data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/anuncios/${id}`)
  },
}

export default anunciosRepository
