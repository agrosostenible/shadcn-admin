/**
 * useDashboardStats - Hook para estadísticas del dashboard en tiempo real
 *
 * Proporciona:
 * - Datos de estadísticas actualizados
 * - Actualización automática vía WebSocket
 * - Polling como fallback
 */

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminStatsService } from '@/services/admin-stats.service'
import { useWebSocket } from './use-websocket'

export function useDashboardStats() {
  const { subscribe } = useWebSocket()
  const [refreshKey, setRefreshKey] = useState(0)

  // Query para estadísticas generales
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats', refreshKey],
    queryFn: () => adminStatsService.getDashboardStats(),
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 10000, // Considerar datos viejos después de 10 segundos
  })

  // Query para usuarios conectados
  const { data: connectedUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['connected-users', refreshKey],
    queryFn: () => adminStatsService.getConnectedUsers(),
    refetchInterval: 15000, // Refetch cada 15 segundos
    staleTime: 5000,
  })

  // Query para lives recientes
  const { data: recentLives, isLoading: isLoadingLives } = useQuery({
    queryKey: ['recent-lives', refreshKey],
    queryFn: () => adminStatsService.getRecentLives(60, 50),
    refetchInterval: 20000, // Refetch cada 20 segundos
    staleTime: 5000,
  })

  // Suscribirse a actualizaciones en tiempo real vía WebSocket
  useEffect(() => {
    // Refrescar cuando cambia el conteo de usuarios
    const unsubUserCount = subscribe('user_count_updated', () => {
      setRefreshKey((prev) => prev + 1)
    })

    // Refrescar cuando se procesa un Live
    const unsubLive = subscribe('Live', (payload) => {
      if (payload.success) {
        setRefreshKey((prev) => prev + 1)
      }
    })

    return () => {
      unsubUserCount()
      unsubLive()
    }
  }, [subscribe])

  return {
    stats,
    connectedUsers: connectedUsers || [],
    recentLives: recentLives || [],
    isLoading: isLoadingStats || isLoadingUsers || isLoadingLives,
  }
}
