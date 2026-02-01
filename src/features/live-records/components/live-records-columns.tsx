import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type LiveRecord } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const liveRecordsColumns: ColumnDef<LiveRecord>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user.telegram_id',
    id: 'telegram_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telegram ID' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm font-semibold'>
        {row.original.user.telegram_id}
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'user.alias',
    id: 'user_alias',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User Alias' />
    ),
    cell: ({ row }) => (
      <div className='text-sm'>
        {row.original.user.alias || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'gate.name',
    id: 'gate_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gate' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='font-mono'>
        {row.original.gate.name}
      </Badge>
    ),
  },
  {
    accessorKey: 'live',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Live Data' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-xs max-w-xs truncate'>
        {row.getValue('live')}
      </div>
    ),
  },
  {
    accessorKey: 'valor_cobrado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Credits Charged' />
    ),
    cell: ({ row }) => (
      <div className='font-semibold text-red-600'>
        -{row.getValue('valor_cobrado')}
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className='text-sm text-muted-foreground'>
          {format(date, 'MMM dd, yyyy HH:mm')}
        </div>
      )
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UUID' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-xs text-muted-foreground max-w-xs truncate'>
        {row.getValue('id')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
