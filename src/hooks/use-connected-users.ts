/**
 * useConnectedUsers - Hook para verificar usuarios conectados
 *
 * Proporciona una lista actualizada de telegram_ids conectados
 */

import { useQuery } from '@tanstack/react-query'
import { adminStatsService } from '@/services/admin-stats.service'
import { useWebSocket } from './use-websocket'
import { useEffect, useState } from 'react'

export function useConnectedUsers() {
  const { subscribe } = useWebSocket()
  const [refreshKey, setRefreshKey] = useState(0)

  // Query para obtener usuarios conectados
  const { data: connectedUsers, isLoading } = useQuery({
    queryKey: ['connected-users-list', refreshKey],
    queryFn: () => adminStatsService.getConnectedUsers(),
    refetchInterval: 10000, // Refetch cada 10 segundos
    staleTime: 5000,
  })

  // Suscribirse a actualizaciones de conteo de usuarios
  useEffect(() => {
    const unsubscribe = subscribe('user_count_updated', () => {
      setRefreshKey((prev) => prev + 1)
    })

    return unsubscribe
  }, [subscribe])

  // Crear un Set de telegram_ids conectados para búsqueda rápida
  const connectedTelegramIds = new Set(
    (connectedUsers || []).map((user) => user.telegram_id)
  )

  // Función helper para verificar si un usuario está conectado
  const isUserConnected = (telegramId: number): boolean => {
    return connectedTelegramIds.has(telegramId)
  }

  return {
    connectedUsers: connectedUsers || [],
    connectedTelegramIds,
    isUserConnected,
    isLoading,
  }
}
