import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Gate } from '../data/schema'
import { useGatesData } from '../hooks/use-gates-data'

interface GatesDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: Gate
}

export function GatesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: GatesDeleteDialogProps) {
  const { deleteGate, isDeleting } = useGatesData()

  const handleDelete = () => {
    deleteGate(currentRow.id)
    onOpenChange()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the gate{' '}
            <span className='font-semibold'>{currentRow.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onOpenChange}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
