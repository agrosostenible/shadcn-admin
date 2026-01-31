import { type Table } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActions } from '@/components/data-table/bulk-actions'
import { type TelegramID } from '../data/schema'
import { useTelegramIDsData } from '../hooks/use-telegram-ids-data'
import { toast } from 'sonner'

interface DataTableBulkActionsProps {
  table: Table<TelegramID>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { deleteTelegramID } = useTelegramIDsData()

  const handleDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)

    if (selectedIds.length === 0) {
      toast.error('No Telegram IDs selected')
      return
    }

    // Delete all selected telegram IDs
    selectedIds.forEach((id) => {
      deleteTelegramID(id)
    })

    // Clear selection
    table.resetRowSelection()
  }

  return (
    <BulkActions table={table} entityName='Telegram ID'>
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
