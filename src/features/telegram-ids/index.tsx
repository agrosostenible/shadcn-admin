import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ManagementPageLayout } from '@/components/layout/management-page-layout'
import { TelegramIDsDialogs } from './components/telegram-ids-dialogs'
import { TelegramIDsFilters } from './components/telegram-ids-filters'
import { TelegramIDsPrimaryButtons } from './components/telegram-ids-primary-buttons'
import { TelegramIDsProvider } from './components/telegram-ids-provider'
import { TelegramIDsTable } from './components/telegram-ids-table'
import { useTelegramIDsData } from './hooks/use-telegram-ids-data'
import { type SearchTelegramIDsParams } from '@/services/telegram-ids.service'

const route = getRouteApi('/_authenticated/telegram-ids/')

export function TelegramIDs() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [searchParams, setSearchParams] = useState<SearchTelegramIDsParams>({})
  const { telegramIDs, isLoading } = useTelegramIDsData(searchParams)

  return (
    <TelegramIDsProvider>
      <ManagementPageLayout
        title='Telegram ID Management'
        description='Manage Telegram IDs whitelist for user registration.'
        primaryButtons={<TelegramIDsPrimaryButtons />}
        filters={<TelegramIDsFilters onFilterChange={setSearchParams} />}
        isLoading={isLoading}
        loadingLabel='Loading Telegram IDs...'
      >
        <TelegramIDsTable data={telegramIDs} search={search} navigate={navigate} />
      </ManagementPageLayout>
      <TelegramIDsDialogs />
    </TelegramIDsProvider>
  )
}
