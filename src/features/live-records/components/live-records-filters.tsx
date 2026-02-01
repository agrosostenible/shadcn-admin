import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type SearchLiveRecordsParams } from '@/services/live-records.service'

interface LiveRecordsFiltersProps {
  onFilterChange: (filters: SearchLiveRecordsParams) => void
}

export function LiveRecordsFilters({ onFilterChange }: LiveRecordsFiltersProps) {
  const [filters, setFilters] = useState<SearchLiveRecordsParams>({})

  // Debounce effect - ejecuta la búsqueda 1 segundo después de dejar de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      // Limpiar valores vacíos antes de enviar
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          acc[key as keyof SearchLiveRecordsParams] = value
        }
        return acc
      }, {} as SearchLiveRecordsParams)

      onFilterChange(cleanFilters)
    }, 1000) // 1 segundo de debounce

    return () => clearTimeout(timer)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof SearchLiveRecordsParams, value: any) => {
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
          <Label htmlFor='gate_name' className='text-xs'>Gate Name</Label>
          <Input
            id='gate_name'
            placeholder='Search...'
            value={filters.gate_name || ''}
            onChange={(e) => handleFilterChange('gate_name', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='live_prefix' className='text-xs'>Live Prefix</Label>
          <Input
            id='live_prefix'
            placeholder='5306...'
            className='font-mono text-sm'
            value={filters.live_prefix || ''}
            onChange={(e) => handleFilterChange('live_prefix', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='date_from' className='text-xs'>From Date</Label>
          <Input
            id='date_from'
            type='date'
            value={filters.date_from || ''}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='date_to' className='text-xs'>To Date</Label>
          <Input
            id='date_to'
            type='date'
            value={filters.date_to || ''}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
