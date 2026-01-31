import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ManagementPageLayout } from '@/components/layout/management-page-layout'
import { GatesDialogs } from './components/gates-dialogs'
import { GatesFilters } from './components/gates-filters'
import { GatesPrimaryButtons } from './components/gates-primary-buttons'
import { GatesProvider } from './components/gates-provider'
import { GatesTable } from './components/gates-table'
import { useGatesData } from './hooks/use-gates-data'
import { type SearchGatesParams } from '@/services/gates.service'

const route = getRouteApi('/_authenticated/gates/')

export function Gates() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [searchParams, setSearchParams] = useState<SearchGatesParams>({})
  const { gates, isLoading } = useGatesData(searchParams)

  return (
    <GatesProvider>
      <ManagementPageLayout
        title='Gates Management'
        description='Manage Terminator models with pricing and discounts.'
        primaryButtons={<GatesPrimaryButtons />}
        filters={<GatesFilters onFilterChange={setSearchParams} />}
        isLoading={isLoading}
        loadingLabel='Loading gates...'
      >
        <GatesTable data={gates} search={search} navigate={navigate} />
      </ManagementPageLayout>
      <GatesDialogs />
    </GatesProvider>
  )
}
