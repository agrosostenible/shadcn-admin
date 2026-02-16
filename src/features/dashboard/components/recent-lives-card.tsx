/**
 * Recent Lives Card - Muestra los lives procesados recientemente
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Zap, CreditCard } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { type RecentLiveRecord } from '@/services/admin-stats.service'

interface RecentLivesCardProps {
  lives: RecentLiveRecord[]
  isLoading?: boolean
}

export function RecentLivesCard({ lives, isLoading }: RecentLivesCardProps) {
  if (isLoading) {
    return (
      <Card className='col-span-1'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Zap className='h-5 w-5' />
            Lives Recientes
          </CardTitle>
          <CardDescription>Últimos 60 minutos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3 animate-pulse'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-20 bg-muted rounded' />
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
          <Zap className='h-5 w-5' />
          Lives Recientes
          <Badge variant='secondary' className='ml-auto'>
            {lives.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Lives procesados en los últimos 60 minutos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          {lives.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Zap className='h-12 w-12 text-muted-foreground mb-3' />
              <p className='text-sm text-muted-foreground'>
                No hay lives recientes
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {lives.map((live) => (
                <div
                  key={live.id}
                  className='p-3 border rounded-lg hover:bg-accent transition-colors space-y-2'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <Badge variant='outline' className='text-xs'>
                          {live.gate_name}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {formatDistanceToNow(new Date(live.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Usuario:{' '}
                        {live.user_alias || `Telegram ${live.user_telegram_id}`}
                      </p>
                    </div>
                    <div className='flex items-center gap-1 text-sm font-semibold shrink-0'>
                      <CreditCard className='h-4 w-4' />
                      <span className='text-red-600'>-{live.valor_cobrado}</span>
                    </div>
                  </div>
                  <div className='bg-muted rounded px-2 py-1'>
                    <p className='text-xs font-mono truncate'>{live.live}</p>
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
