import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ManagementPageLayout } from '@/components/layout/management-page-layout'
import { LiveRecordsDialogs } from './components/live-records-dialogs'
import { LiveRecordsFilters } from './components/live-records-filters'
import { LiveRecordsPrimaryButtons } from './components/live-records-primary-buttons'
import { LiveRecordsProvider } from './components/live-records-provider'
import { LiveRecordsTable } from './components/live-records-table'
import { useLiveRecordsData } from './hooks/use-live-records-data'
import { type SearchLiveRecordsParams } from '@/services/live-records.service'

const route = getRouteApi('/_authenticated/live-records/')

export function LiveRecords() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [searchParams, setSearchParams] = useState<SearchLiveRecordsParams>({})
  const { liveRecords, isLoading } = useLiveRecordsData(searchParams)

  return (
    <LiveRecordsProvider>
      <ManagementPageLayout
        title='Live Records Management'
        description='View and manage live usage records with user and gate information.'
        primaryButtons={<LiveRecordsPrimaryButtons />}
        filters={<LiveRecordsFilters onFilterChange={setSearchParams} />}
        isLoading={isLoading}
        loadingLabel='Loading live records...'
      >
        <LiveRecordsTable data={liveRecords} search={search} navigate={navigate} />
      </ManagementPageLayout>
      <LiveRecordsDialogs />
    </LiveRecordsProvider>
  )
}
