import { GatesActionDialog } from './gates-action-dialog'
import { GatesDeleteDialog } from './gates-delete-dialog'
import { useGates } from './gates-provider'

export function GatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGates()
  return (
    <>
      <GatesActionDialog
        key='gate-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <GatesActionDialog
            key={`gate-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <GatesDeleteDialog
            key={`gate-delete-${currentRow.id}`}
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
