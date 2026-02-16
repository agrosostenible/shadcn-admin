/**
 * Stats Cards - Tarjetas de estadísticas del dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Zap, CreditCard, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon && <div className='h-4 w-4 text-muted-foreground'>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              'text-xs mt-1 flex items-center gap-1',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            <TrendingUp className='h-3 w-3' />
            <span>
              {trend.isPositive ? '+' : ''}
              {trend.value}% desde la última hora
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  connectedUsersCount: number
  recentLivesCount: number
  creditsSpent: number
  totalUsers: number
  totalGates: number
  isLoading?: boolean
}

export function StatsCards({
  connectedUsersCount,
  recentLivesCount,
  creditsSpent,
  totalUsers,
  totalGates,
  isLoading,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardHeader className='pb-2'>
              <div className='h-4 w-24 bg-muted rounded' />
            </CardHeader>
            <CardContent>
              <div className='h-8 w-16 bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Usuarios Conectados'
        value={connectedUsersCount}
        description={`De ${totalUsers} usuarios totales`}
        icon={<Users />}
      />

      <StatCard
        title='Lives (Última Hora)'
        value={recentLivesCount}
        description='Lives procesados en los últimos 60 minutos'
        icon={<Zap />}
      />

      <StatCard
        title='Créditos Gastados'
        value={creditsSpent.toLocaleString()}
        description='En la última hora'
        icon={<CreditCard />}
      />

      <StatCard
        title='Gates Activos'
        value={totalGates}
        description='Total de gates disponibles'
        icon={<TrendingUp />}
      />
    </div>
  )
}
