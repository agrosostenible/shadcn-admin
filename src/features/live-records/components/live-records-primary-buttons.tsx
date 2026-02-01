import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLiveRecords } from './live-records-provider'

export function LiveRecordsPrimaryButtons() {
  const { setOpen } = useLiveRecords()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Live Record</span> <Plus size={18} />
    </Button>
  )
}
