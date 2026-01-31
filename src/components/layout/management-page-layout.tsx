import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

interface ManagementPageLayoutProps {
  title: string
  description: string
  primaryButtons: React.ReactNode
  filters: React.ReactNode
  isLoading?: boolean
  loadingLabel?: string
  children: React.ReactNode
}

export function ManagementPageLayout({
  title,
  description,
  primaryButtons,
  filters,
  isLoading = false,
  loadingLabel = 'Loading...',
  children,
}: ManagementPageLayoutProps) {
  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <p className='text-muted-foreground'>{description}</p>
          </div>
          {primaryButtons}
        </div>
        {filters}
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-muted-foreground'>{loadingLabel}</div>
          </div>
        ) : (
          children
        )}
      </Main>
    </>
  )
}
