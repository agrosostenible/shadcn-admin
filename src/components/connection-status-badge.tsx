/**
 * Connection Status Badge - Indicador de estado de conexión
 */

import { Badge } from '@/components/ui/badge'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConnectionStatusBadgeProps {
  isConnected: boolean
  variant?: 'default' | 'compact'
  className?: string
}

export function ConnectionStatusBadge({
  isConnected,
  variant = 'default',
  className,
}: ConnectionStatusBadgeProps) {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'relative inline-flex h-2 w-2 rounded-full',
          isConnected ? 'bg-green-500' : 'bg-gray-400',
          isConnected && 'animate-pulse',
          className
        )}
        title={isConnected ? 'Conectado' : 'Desconectado'}
      />
    )
  }

  return (
    <Badge
      variant={isConnected ? 'default' : 'secondary'}
      className={cn('gap-1.5 text-xs', className)}
    >
      <Circle
        className={cn(
          'h-2 w-2',
          isConnected && 'fill-green-500 text-green-500 animate-pulse'
        )}
      />
      {isConnected ? 'En línea' : 'Desconectado'}
    </Badge>
  )
}
