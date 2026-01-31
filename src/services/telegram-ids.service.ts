/**
 * Telegram IDs Service - Gestión de Telegram IDs
 */
import { apiClient } from './api'

export interface TelegramID {
  id: string
  telegram_id: number
}

export interface CreateTelegramIDData {
  telegram_id: number
}

export interface UpdateTelegramIDData {
  telegram_id: number
}

export interface SearchTelegramIDsParams {
  telegram_id?: number
  in_use?: boolean
  skip?: number
  limit?: number
}

class TelegramIDsService {
  /**
   * Obtener todos los Telegram IDs
   */
  async getTelegramIDs(skip: number = 0, limit: number = 100): Promise<TelegramID[]> {
    const response = await apiClient.get<TelegramID[]>('/telegram-ids', {
      params: { skip, limit },
    })
    return response.data
  }

  /**
   * Buscar Telegram IDs con filtros
   */
  async searchTelegramIDs(params: SearchTelegramIDsParams): Promise<TelegramID[]> {
    const response = await apiClient.get<TelegramID[]>('/telegram-ids/search', {
      params,
    })
    return response.data
  }

  /**
   * Obtener un Telegram ID por UUID
   */
  async getTelegramID(telegramIdUuid: string): Promise<TelegramID> {
    const response = await apiClient.get<TelegramID>(`/telegram-ids/${telegramIdUuid}`)
    return response.data
  }

  /**
   * Buscar Telegram ID por valor
   */
  async getTelegramIDByValue(telegramIdValue: number): Promise<TelegramID> {
    const response = await apiClient.get<TelegramID>(`/telegram-ids/by-value/${telegramIdValue}`)
    return response.data
  }

  /**
   * Crear un nuevo Telegram ID
   */
  async createTelegramID(telegramData: CreateTelegramIDData): Promise<TelegramID> {
    const response = await apiClient.post<TelegramID>('/telegram-ids', telegramData)
    return response.data
  }

  /**
   * Actualizar un Telegram ID
   */
  async updateTelegramID(telegramIdUuid: string, telegramData: UpdateTelegramIDData): Promise<TelegramID> {
    const response = await apiClient.put<TelegramID>(`/telegram-ids/${telegramIdUuid}`, telegramData)
    return response.data
  }

  /**
   * Eliminar un Telegram ID
   */
  async deleteTelegramID(telegramIdUuid: string): Promise<void> {
    await apiClient.delete(`/telegram-ids/${telegramIdUuid}`)
  }
}

export const telegramIDsService = new TelegramIDsService()
