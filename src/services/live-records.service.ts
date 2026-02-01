/**
 * Live Records Service - Gestión de registros de uso de gates
 */
import { apiClient } from './api'

export interface UserInfo {
  id: string
  device_id: string
  telegram_id: number
  alias: string | null
}

export interface GateInfo {
  id: string
  name: string
  description: string | null
  valor: number
  valor_con_descuento: number | null
  descuento_activo: boolean
}

export interface LiveRecord {
  id: string
  user_id: string
  gate_id: string
  live: string
  valor_cobrado: number
  created_at: string
  user: UserInfo
  gate: GateInfo
}

export interface CreateLiveRecordData {
  user_id: string
  gate_id: string
  live: string
  valor_cobrado: number
}

export interface UpdateLiveRecordData {
  live?: string
}

export interface SearchLiveRecordsParams {
  user_id?: string
  gate_id?: string
  telegram_id?: number
  gate_name?: string
  live_prefix?: string
  date_from?: string
  date_to?: string
  skip?: number
  limit?: number
}

class LiveRecordsService {
  /**
   * Obtener todos los live records
   */
  async getLiveRecords(skip: number = 0, limit: number = 100): Promise<LiveRecord[]> {
    const response = await apiClient.get<LiveRecord[]>('/live-records', {
      params: { skip, limit },
    })
    return response.data
  }

  /**
   * Buscar live records con filtros
   */
  async searchLiveRecords(params: SearchLiveRecordsParams): Promise<LiveRecord[]> {
    const response = await apiClient.get<LiveRecord[]>('/live-records/search', {
      params,
    })
    return response.data
  }

  /**
   * Obtener un live record por ID
   */
  async getLiveRecord(liveRecordId: string): Promise<LiveRecord> {
    const response = await apiClient.get<LiveRecord>(`/live-records/${liveRecordId}`)
    return response.data
  }

  /**
   * Crear un nuevo live record
   */
  async createLiveRecord(liveRecordData: CreateLiveRecordData): Promise<LiveRecord> {
    const response = await apiClient.post<LiveRecord>('/live-records', liveRecordData)
    return response.data
  }

  /**
   * Actualizar un live record
   */
  async updateLiveRecord(liveRecordId: string, liveRecordData: UpdateLiveRecordData): Promise<LiveRecord> {
    const response = await apiClient.put<LiveRecord>(`/live-records/${liveRecordId}`, liveRecordData)
    return response.data
  }

  /**
   * Eliminar un live record
   */
  async deleteLiveRecord(liveRecordId: string): Promise<void> {
    await apiClient.delete(`/live-records/${liveRecordId}`)
  }
}

export const liveRecordsService = new LiveRecordsService()
