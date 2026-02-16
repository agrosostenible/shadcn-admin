/**
 * WebSocket Service - Conexión en tiempo real con el servidor
 *
 * Proporciona:
 * - Conexión WebSocket con reconexión automática
 * - Suscripción a eventos en tiempo real
 * - Manejo de estado de conexión
 */

type MessageType =
  | 'connected'
  | 'error'
  | 'pong'
  | 'user_count_updated'
  | 'gate_removed'
  | 'user_updated'
  | 'Live'

interface WebSocketMessage {
  type: MessageType
  payload: Record<string, any>
}

type MessageHandler = (payload: Record<string, any>) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private token: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000 // 3 segundos
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private messageHandlers: Map<MessageType, Set<MessageHandler>> = new Map()
  private connectionHandlers: Set<() => void> = new Set()
  private disconnectionHandlers: Set<() => void> = new Set()
  private isIntentionalClose = false

  constructor() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    // Convertir HTTP a WS
    this.url = API_URL.replace(/^http/, 'ws')
  }

  /**
   * Conectar al WebSocket con un token JWT
   */
  connect(token: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[WS] Ya conectado')
      return
    }

    this.token = token
    this.isIntentionalClose = false
    this._connect()
  }

  private _connect(): void {
    if (!this.token) {
      console.error('[WS] No hay token disponible')
      return
    }

    try {
      const wsUrl = `${this.url}/ws?token=${this.token}`
      console.log('[WS] Conectando...', wsUrl)

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this._handleOpen.bind(this)
      this.ws.onmessage = this._handleMessage.bind(this)
      this.ws.onerror = this._handleError.bind(this)
      this.ws.onclose = this._handleClose.bind(this)
    } catch (error) {
      console.error('[WS] Error al crear WebSocket:', error)
      this._scheduleReconnect()
    }
  }

  private _handleOpen(): void {
    console.log('[WS] Conectado')
    this.reconnectAttempts = 0
    this.connectionHandlers.forEach((handler) => handler())
  }

  private _handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log('[WS] Mensaje recibido:', message)

      const handlers = this.messageHandlers.get(message.type)
      if (handlers) {
        handlers.forEach((handler) => handler(message.payload))
      }
    } catch (error) {
      console.error('[WS] Error al parsear mensaje:', error)
    }
  }

  private _handleError(error: Event): void {
    console.error('[WS] Error:', error)
  }

  private _handleClose(event: CloseEvent): void {
    console.log('[WS] Desconectado:', event.code, event.reason)
    this.disconnectionHandlers.forEach((handler) => handler())

    // Reconectar solo si no fue un cierre intencional
    if (!this.isIntentionalClose) {
      this._scheduleReconnect()
    }
  }

  private _scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(
        '[WS] Máximo de intentos de reconexión alcanzado'
      )
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    console.log(
      `[WS] Reconectando en ${delay / 1000}s (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    )

    this.reconnectTimeout = setTimeout(() => {
      this._connect()
    }, delay)
  }

  /**
   * Desconectar del WebSocket
   */
  disconnect(): void {
    this.isIntentionalClose = true

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.token = null
    this.reconnectAttempts = 0
  }

  /**
   * Enviar un mensaje al servidor
   */
  send(message: Record<string, any>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[WS] No conectado, no se puede enviar mensaje')
      return
    }

    this.ws.send(JSON.stringify(message))
  }

  /**
   * Suscribirse a un tipo de mensaje
   */
  on(type: MessageType, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set())
    }

    this.messageHandlers.get(type)!.add(handler)

    // Retornar función para desuscribirse
    return () => {
      this.messageHandlers.get(type)?.delete(handler)
    }
  }

  /**
   * Suscribirse al evento de conexión
   */
  onConnect(handler: () => void): () => void {
    this.connectionHandlers.add(handler)
    return () => {
      this.connectionHandlers.delete(handler)
    }
  }

  /**
   * Suscribirse al evento de desconexión
   */
  onDisconnect(handler: () => void): () => void {
    this.disconnectionHandlers.add(handler)
    return () => {
      this.disconnectionHandlers.delete(handler)
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * Enviar ping al servidor
   */
  ping(): void {
    this.send({ type: 'ping' })
  }

  /**
   * Solicitar conteo de usuarios en línea
   */
  requestOnlineCount(): void {
    this.send({ type: 'online_count' })
  }
}

// Instancia singleton
export const wsService = new WebSocketService()