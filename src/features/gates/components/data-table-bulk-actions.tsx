import { type Table } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActions } from '@/components/data-table/bulk-actions'
import { type Gate } from '../data/schema'
import { useGatesData } from '../hooks/use-gates-data'
import { toast } from 'sonner'

interface DataTableBulkActionsProps {
  table: Table<Gate>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { deleteGate } = useGatesData()

  const handleDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)

    if (selectedIds.length === 0) {
      toast.error('No gates selected')
      return
    }

    selectedIds.forEach((id) => {
      deleteGate(id)
    })

    table.resetRowSelection()
  }

  return (
    <BulkActions table={table} entityName='gate'>
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
