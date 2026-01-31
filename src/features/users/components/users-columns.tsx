import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { roles } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
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
    accessorKey: 'device_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Device ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('device_id')}</LongText>
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
    accessorKey: 'alias',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Alias' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('alias') || '-'}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'mac_address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='MAC Address' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap font-mono text-sm'>
        {row.getValue('mac_address')}
      </div>
    ),
  },
  {
    accessorKey: 'telegram_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telegram ID' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('telegram_id')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'credits',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Credits' />
    ),
    cell: ({ row }) => (
      <div className='text-center font-semibold'>{row.getValue('credits')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const { role } = row.original
      const userType = roles.find(({ value }) => value === role.name)

      if (!userType) {
        return null
      }

      return (
        <div className='flex items-center gap-x-2'>
          {userType.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm capitalize'>{role.name}</span>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.role.name)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
