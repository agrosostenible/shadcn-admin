/**
 * Admin Stats Service - Estadísticas en tiempo real para administradores
 */
import { apiClient } from './api'

export interface ConnectedUser {
  telegram_id: number
  user_id: string
  device_id: string
  role: string
}

export interface RecentLiveRecord {
  id: string
  user_id: string
  gate_id: string
  gate_name: string
  live: string
  valor_cobrado: number
  created_at: string
  user_alias: string | null
  user_telegram_id: number
}

export interface DashboardStats {
  connected_users_count: number
  recent_lives_count: number
  credits_spent_last_hour: number
  total_users: number
  total_gates: number
}

export interface CreditsTimelinePoint {
  timestamp: string
  credits: number
}

class AdminStatsService {
  /**
   * Obtener usuarios conectados actualmente
   */
  async getConnectedUsers(): Promise<ConnectedUser[]> {
    const response = await apiClient.get<ConnectedUser[]>(
      '/admin/stats/connected-users'
    )
    return response.data
  }

  /**
   * Obtener lives procesados recientemente
   */
  async getRecentLives(
    minutes: number = 60,
    limit: number = 100
  ): Promise<RecentLiveRecord[]> {
    const response = await apiClient.get<RecentLiveRecord[]>(
      '/admin/stats/recent-lives',
      {
        params: { minutes, limit },
      }
    )
    return response.data
  }

  /**
   * Obtener estadísticas del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(
      '/admin/stats/dashboard'
    )
    return response.data
  }

  /**
   * Obtener timeline de créditos gastados
   */
  async getCreditsTimeline(
    hours: number = 24,
    intervalMinutes: number = 60
  ): Promise<CreditsTimelinePoint[]> {
    const response = await apiClient.get<CreditsTimelinePoint[]>(
      '/admin/stats/credits-timeline',
      {
        params: {
          hours,
          interval_minutes: intervalMinutes,
        },
      }
    )
    return response.data
  }
}

export const adminStatsService = new AdminStatsService()
