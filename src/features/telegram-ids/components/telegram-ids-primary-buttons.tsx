import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTelegramIDs } from './telegram-ids-provider'

export function TelegramIDsPrimaryButtons() {
  const { setOpen } = useTelegramIDs()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Telegram ID</span> <MessageSquarePlus size={18} />
    </Button>
  )
}
