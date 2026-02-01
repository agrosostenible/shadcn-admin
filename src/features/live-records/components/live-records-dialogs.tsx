import { LiveRecordsActionDialog } from './live-records-action-dialog'
import { LiveRecordsDeleteDialog } from './live-records-delete-dialog'
import { useLiveRecords } from './live-records-provider'

export function LiveRecordsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLiveRecords()
  return (
    <>
      <LiveRecordsActionDialog
        key='live-record-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <LiveRecordsActionDialog
            key={`live-record-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <LiveRecordsDeleteDialog
            key={`live-record-delete-${currentRow.id}`}
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
