import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGates } from './gates-provider'

export function GatesPrimaryButtons() {
  const { setOpen } = useGates()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Gate</span> <Zap size={18} />
    </Button>
  )
}
