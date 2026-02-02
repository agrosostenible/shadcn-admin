import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Gate } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const gatesColumns: ColumnDef<Gate>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='ps-3 font-mono text-lg font-semibold'>
        {row.getValue('name')}
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
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <div className='text-sm text-muted-foreground max-w-xs truncate'>
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Roles' />
    ),
    cell: ({ row }) => {
      const roles = row.original.roles || []
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Badge key={role.id} variant='outline' className='capitalize'>
                {role.name}
              </Badge>
            ))
          ) : (
            <span className='text-sm text-muted-foreground'>No roles</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'valor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => (
      <div className='font-semibold'>
        ${row.getValue('valor')}
      </div>
    ),
  },
  {
    accessorKey: 'valor_con_descuento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount Price' />
    ),
    cell: ({ row }) => (
      <div className='font-semibold text-green-600'>
        ${row.getValue('valor_con_descuento')}
      </div>
    ),
  },
  {
    accessorKey: 'descuento_activo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount Active' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('descuento_activo') ? 'default' : 'secondary'}>
        {row.getValue('descuento_activo') ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('estado') ? 'default' : 'destructive'}>
        {row.getValue('estado') ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'ruta',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Route' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>
        {row.getValue('ruta') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UUID' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-xs text-muted-foreground'>
        {row.getValue('id')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
