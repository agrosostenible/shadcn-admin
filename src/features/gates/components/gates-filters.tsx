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
import { Switch } from '@/components/ui/switch'
import { type SearchGatesParams } from '@/services/gates.service'

interface GatesFiltersProps {
  onFilterChange: (filters: SearchGatesParams) => void
}

export function GatesFilters({ onFilterChange }: GatesFiltersProps) {
  const [filters, setFilters] = useState<SearchGatesParams>({})

  // Debounce effect - ejecuta la búsqueda 1 segundo después de dejar de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      // Limpiar valores vacíos antes de enviar
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          acc[key as keyof SearchGatesParams] = value
        }
        return acc
      }, {} as SearchGatesParams)

      onFilterChange(cleanFilters)
    }, 1000) // 1 segundo de debounce

    return () => clearTimeout(timer)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof SearchGatesParams, value: any) => {
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
      <div className='grid gap-3 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-6'>
        <div className='space-y-1.5'>
          <Label htmlFor='name' className='text-xs'>Name</Label>
          <Input
            id='name'
            placeholder='Search...'
            value={filters.name || ''}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='description' className='text-xs'>Description</Label>
          <Input
            id='description'
            placeholder='Search...'
            value={filters.description || ''}
            onChange={(e) => handleFilterChange('description', e.target.value)}
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

        <div className='space-y-1.5'>
          <Label htmlFor='min_valor' className='text-xs'>Min Price</Label>
          <Input
            id='min_valor'
            type='number'
            placeholder='0'
            value={filters.min_valor || ''}
            onChange={(e) =>
              handleFilterChange('min_valor', e.target.value ? parseInt(e.target.value) : '')
            }
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='max_valor' className='text-xs'>Max Price</Label>
          <Input
            id='max_valor'
            type='number'
            placeholder='999999'
            value={filters.max_valor || ''}
            onChange={(e) =>
              handleFilterChange('max_valor', e.target.value ? parseInt(e.target.value) : '')
            }
          />
        </div>

        <div className='flex items-center space-x-2 pt-6'>
          <Switch
            id='descuento_activo'
            checked={filters.descuento_activo ?? false}
            onCheckedChange={(checked) =>
              handleFilterChange('descuento_activo', checked ? true : undefined)
            }
          />
          <Label htmlFor='descuento_activo' className='cursor-pointer text-xs'>
            Only with discount
          </Label>
        </div>
      </div>
    </div>
  )
}
