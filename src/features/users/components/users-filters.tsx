import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type SearchUsersParams } from '@/services/users.service'

interface UsersFiltersProps {
  onFilterChange: (filters: SearchUsersParams) => void
}

export function UsersFilters({ onFilterChange }: UsersFiltersProps) {
  const [filters, setFilters] = useState<SearchUsersParams>({})

  // Debounce effect - ejecuta la búsqueda 1 segundo después de dejar de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      // Limpiar valores vacíos antes de enviar
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          acc[key as keyof SearchUsersParams] = value
        }
        return acc
      }, {} as SearchUsersParams)

      onFilterChange(cleanFilters)
    }, 1000) // 1 segundo de debounce

    return () => clearTimeout(timer)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof SearchUsersParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleClear = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== undefined && v !== null)

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium'>Search Filters</h3>
        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={handleClear}>
            <X className='mr-2 h-4 w-4' />
            Clear all
          </Button>
        )}
      </div>
      <div className='grid gap-3 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-5'>
        <div className='space-y-1.5'>
          <Label htmlFor='device_id' className='text-xs'>Device ID</Label>
          <Input
            id='device_id'
            placeholder='Search...'
            value={filters.device_id || ''}
            onChange={(e) => handleFilterChange('device_id', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='mac_address' className='text-xs'>MAC Address</Label>
          <Input
            id='mac_address'
            placeholder='XX:XX:XX:XX:XX:XX'
            className='font-mono text-sm'
            value={filters.mac_address || ''}
            onChange={(e) => handleFilterChange('mac_address', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='telegram_id' className='text-xs'>Telegram ID</Label>
          <Input
            id='telegram_id'
            type='number'
            placeholder='123456789'
            className='font-mono text-sm'
            value={filters.telegram_id || ''}
            onChange={(e) =>
              handleFilterChange('telegram_id', e.target.value ? parseInt(e.target.value) : '')
            }
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='alias' className='text-xs'>Alias</Label>
          <Input
            id='alias'
            placeholder='Search...'
            value={filters.alias || ''}
            onChange={(e) => handleFilterChange('alias', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='role_name' className='text-xs'>Role</Label>
          <Select
            value={filters.role_name || 'all'}
            onValueChange={(value) =>
              handleFilterChange('role_name', value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='All roles' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All roles</SelectItem>
              <SelectItem value='user'>User</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
