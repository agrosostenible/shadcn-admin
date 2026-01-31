/**
 * Gates Service - Gestión de Gates (productos tipo Terminator)
 */
import { apiClient } from './api'

export interface Role {
  id: string
  name: string
}

export interface Gate {
  id: string
  name: string
  description: string | null
  valor: number
  valor_con_descuento: number
  descuento_activo: boolean
  roles?: Role[]
}

export interface CreateGateData {
  name: string
  description?: string
  valor: number
  valor_con_descuento: number
  descuento_activo?: boolean
  role_ids?: string[]
}

export interface UpdateGateData {
  name?: string
  description?: string
  valor?: number
  valor_con_descuento?: number
  descuento_activo?: boolean
  role_ids?: string[]
}

export interface SearchGatesParams {
  name?: string
  description?: string
  role_name?: string
  descuento_activo?: boolean
  min_valor?: number
  max_valor?: number
  skip?: number
  limit?: number
}

class GatesService {
  /**
   * Obtener todos los Gates
   */
  async getGates(skip: number = 0, limit: number = 100): Promise<Gate[]> {
    const response = await apiClient.get<Gate[]>('/gates', {
      params: { skip, limit },
    })
    return response.data
  }

  /**
   * Buscar gates con filtros
   */
  async searchGates(params: SearchGatesParams): Promise<Gate[]> {
    const response = await apiClient.get<Gate[]>('/gates/search', {
      params,
    })
    return response.data
  }

  /**
   * Obtener un Gate por UUID
   */
  async getGate(gateId: string): Promise<Gate> {
    const response = await apiClient.get<Gate>(`/gates/${gateId}`)
    return response.data
  }

  /**
   * Crear un nuevo Gate
   */
  async createGate(gateData: CreateGateData): Promise<Gate> {
    const response = await apiClient.post<Gate>('/gates', gateData)
    return response.data
  }

  /**
   * Actualizar un Gate
   */
  async updateGate(gateId: string, gateData: UpdateGateData): Promise<Gate> {
    const response = await apiClient.put<Gate>(`/gates/${gateId}`, gateData)
    return response.data
  }

  /**
   * Eliminar un Gate
   */
  async deleteGate(gateId: string): Promise<void> {
    await apiClient.delete(`/gates/${gateId}`)
  }

  /**
   * Asociar un Gate con un Rol
   */
  async addRoleToGate(gateId: string, roleId: string): Promise<Gate> {
    const response = await apiClient.post<Gate>(`/gates/${gateId}/roles/${roleId}`)
    return response.data
  }

  /**
   * Desasociar un Gate de un Rol
   */
  async removeRoleFromGate(gateId: string, roleId: string): Promise<Gate> {
    const response = await apiClient.delete<Gate>(`/gates/${gateId}/roles/${roleId}`)
    return response.data
  }
}

export const gatesService = new GatesService()
