import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ManagementPageLayout } from '@/components/layout/management-page-layout'
import { UsersDialogs } from './components/users-dialogs'
import { UsersFilters } from './components/users-filters'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsersData } from './hooks/use-users-data'
import { type SearchUsersParams } from '@/services/users.service'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [searchParams, setSearchParams] = useState<SearchUsersParams>({})
  const { users, isLoading } = useUsersData(searchParams)

  return (
    <UsersProvider>
      <ManagementPageLayout
        title='User Management'
        description='Manage users, their Telegram IDs, and credits.'
        primaryButtons={<UsersPrimaryButtons />}
        filters={<UsersFilters onFilterChange={setSearchParams} />}
        isLoading={isLoading}
        loadingLabel='Loading users...'
      >
        <UsersTable data={users} search={search} navigate={navigate} />
      </ManagementPageLayout>
      <UsersDialogs />
    </UsersProvider>
  )
}
