import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type TelegramID } from '../data/schema'
import { useTelegramIDsData } from '../hooks/use-telegram-ids-data'

interface TelegramIDsDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: TelegramID
}

export function TelegramIDsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: TelegramIDsDeleteDialogProps) {
  const { deleteTelegramID, isDeleting } = useTelegramIDsData()

  const handleDelete = () => {
    deleteTelegramID(currentRow.id)
    onOpenChange()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the Telegram ID{' '}
            <span className='font-semibold'>{currentRow.telegram_id}</span> from
            the whitelist.
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
