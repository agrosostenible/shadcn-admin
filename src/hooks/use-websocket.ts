/**
 * useWebSocket - Hook para manejar conexiones WebSocket
 *
 * Proporciona:
 * - Conexión automática con el token del usuario
 * - Desconexión automática al desmontar
 * - Estado de conexión
 * - Métodos para enviar mensajes y suscribirse a eventos
 */

import { useEffect, useState, useCallback } from 'react'
import { wsService } from '@/services/websocket.service'
import { useAuthStore } from '@/stores/auth-store'

export function useWebSocket() {
  const { auth } = useAuthStore()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Conectar solo si hay un token y es admin
    if (auth.accessToken && auth.user?.role.includes('admin')) {
      wsService.connect(auth.accessToken)

      const unsubConnected = wsService.onConnect(() => {
        setIsConnected(true)
      })

      const unsubDisconnected = wsService.onDisconnect(() => {
        setIsConnected(false)
      })

      // Verificar estado inicial
      setIsConnected(wsService.isConnected())

      return () => {
        unsubConnected()
        unsubDisconnected()
        wsService.disconnect()
      }
    }
  }, [auth.accessToken, auth.user?.role])

  const send = useCallback((message: Record<string, any>) => {
    wsService.send(message)
  }, [])

  const ping = useCallback(() => {
    wsService.ping()
  }, [])

  const requestOnlineCount = useCallback(() => {
    wsService.requestOnlineCount()
  }, [])

  return {
    isConnected,
    send,
    ping,
    requestOnlineCount,
    subscribe: wsService.on.bind(wsService),
  }
}
