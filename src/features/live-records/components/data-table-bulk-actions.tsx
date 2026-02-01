import { type Table } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActions } from '@/components/data-table/bulk-actions'
import { type LiveRecord } from '../data/schema'
import { useLiveRecordsData } from '../hooks/use-live-records-data'
import { toast } from 'sonner'

interface DataTableBulkActionsProps {
  table: Table<LiveRecord>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { deleteLiveRecord } = useLiveRecordsData()

  const handleDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)

    if (selectedIds.length === 0) {
      toast.error('No live records selected')
      return
    }

    selectedIds.forEach((id) => {
      deleteLiveRecord(id)
    })

    table.resetRowSelection()
  }

  return (
    <BulkActions table={table} entityName='live record'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleDelete}
        className='space-x-1'
      >
        <Trash size={16} />
        <span>Delete</span>
      </Button>
    </BulkActions>
  )
}
