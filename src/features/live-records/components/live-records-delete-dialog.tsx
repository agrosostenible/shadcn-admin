import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type LiveRecord } from '../data/schema'
import { useLiveRecordsData } from '../hooks/use-live-records-data'

interface LiveRecordsDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: LiveRecord
}

export function LiveRecordsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: LiveRecordsDeleteDialogProps) {
  const { deleteLiveRecord, isDeleting } = useLiveRecordsData()

  const handleDelete = () => {
    deleteLiveRecord(currentRow.id)
    onOpenChange()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the live record from user{' '}
            <span className='font-semibold'>{currentRow.user.telegram_id}</span> using gate{' '}
            <span className='font-semibold'>{currentRow.gate.name}</span>.
            This action cannot be undone and will NOT restore credits.
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
