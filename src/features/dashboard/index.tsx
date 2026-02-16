import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { StatsCards } from './components/stats-cards'
import { ConnectedUsersCard } from './components/connected-users-card'
import { RecentLivesCard } from './components/recent-lives-card'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { useWebSocket } from '@/hooks/use-websocket'

export function Dashboard() {
  const { isConnected } = useWebSocket()
  const { stats, connectedUsers, recentLives, isLoading } = useDashboardStats()

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Panel de administración en tiempo real
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant={isConnected ? 'default' : 'secondary'} className='gap-1'>
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Tarjetas de estadísticas */}
          <StatsCards
            connectedUsersCount={stats?.connected_users_count || 0}
            recentLivesCount={stats?.recent_lives_count || 0}
            creditsSpent={stats?.credits_spent_last_hour || 0}
            totalUsers={stats?.total_users || 0}
            totalGates={stats?.total_gates || 0}
            isLoading={isLoading}
          />

          {/* Grids de información en tiempo real */}
          <div className='grid gap-6 lg:grid-cols-2'>
            <ConnectedUsersCard
              users={connectedUsers}
              isLoading={isLoading}
            />
            <RecentLivesCard
              lives={recentLives}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Users',
    href: '/users',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Gates',
    href: '/gates',
    isActive: false,
    disabled: false,
  },
]
