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
import { type SearchTelegramIDsParams } from '@/services/telegram-ids.service'

interface TelegramIDsFiltersProps {
  onFilterChange: (filters: SearchTelegramIDsParams) => void
}

export function TelegramIDsFilters({ onFilterChange }: TelegramIDsFiltersProps) {
  const [filters, setFilters] = useState<SearchTelegramIDsParams>({})

  // Debounce effect - ejecuta la búsqueda 1 segundo después de dejar de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      // Limpiar valores vacíos antes de enviar
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          acc[key as keyof SearchTelegramIDsParams] = value
        }
        return acc
      }, {} as SearchTelegramIDsParams)

      onFilterChange(cleanFilters)
    }, 1000) // 1 segundo de debounce

    return () => clearTimeout(timer)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof SearchTelegramIDsParams, value: any) => {
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
      <div className='grid gap-3 rounded-lg border p-4 md:grid-cols-3'>
        <div className='space-y-1.5'>
          <Label htmlFor='telegram_id' className='text-xs'>Telegram ID</Label>
          <Input
            id='telegram_id'
            type='number'
            placeholder='Search by ID...'
            className='font-mono text-sm'
            value={filters.telegram_id || ''}
            onChange={(e) =>
              handleFilterChange('telegram_id', e.target.value ? parseInt(e.target.value) : '')
            }
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='in_use' className='text-xs'>Status</Label>
          <Select
            value={filters.in_use === undefined ? 'all' : filters.in_use.toString()}
            onValueChange={(value) => {
              if (value === 'all') {
                handleFilterChange('in_use', undefined)
              } else {
                handleFilterChange('in_use', value === 'true')
              }
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='All' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='true'>In use</SelectItem>
              <SelectItem value='false'>Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
