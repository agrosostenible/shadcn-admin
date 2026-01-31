import { TelegramIDsActionDialog } from './telegram-ids-action-dialog'
import { TelegramIDsDeleteDialog } from './telegram-ids-delete-dialog'
import { useTelegramIDs } from './telegram-ids-provider'

export function TelegramIDsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTelegramIDs()
  return (
    <>
      <TelegramIDsActionDialog
        key='telegram-id-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TelegramIDsActionDialog
            key={`telegram-id-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <TelegramIDsDeleteDialog
            key={`telegram-id-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
