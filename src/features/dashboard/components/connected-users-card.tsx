/**
 * Connected Users Card - Muestra los usuarios conectados actualmente
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Circle } from 'lucide-react'
import { type ConnectedUser } from '@/services/admin-stats.service'

interface ConnectedUsersCardProps {
  users: ConnectedUser[]
  isLoading?: boolean
}

export function ConnectedUsersCard({ users, isLoading }: ConnectedUsersCardProps) {
  if (isLoading) {
    return (
      <Card className='col-span-1'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Usuarios Conectados
          </CardTitle>
          <CardDescription>En tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3 animate-pulse'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-16 bg-muted rounded' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-1'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Usuarios Conectados
          <Badge variant='secondary' className='ml-auto'>
            {users.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Usuarios activos por WebSocket en este momento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          {users.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Users className='h-12 w-12 text-muted-foreground mb-3' />
              <p className='text-sm text-muted-foreground'>
                No hay usuarios conectados
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className='flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors'
                >
                  <Circle className='h-2 w-2 fill-green-500 text-green-500 mt-2' />
                  <div className='flex-1 space-y-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-medium truncate'>
                        Telegram: {user.telegram_id}
                      </p>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className='text-xs'>
                        {user.role}
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground truncate'>
                      Device: {user.device_id}
                    </p>
                    <p className='text-xs text-muted-foreground truncate font-mono'>
                      ID: {user.user_id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
