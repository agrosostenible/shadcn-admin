import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LiveRecord } from '../data/schema'

type LiveRecordsDialogType = 'add' | 'edit' | 'delete'

type LiveRecordsContextType = {
  open: LiveRecordsDialogType | null
  setOpen: (str: LiveRecordsDialogType | null) => void
  currentRow: LiveRecord | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LiveRecord | null>>
}

const LiveRecordsContext = React.createContext<LiveRecordsContextType | null>(null)

export function LiveRecordsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LiveRecordsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LiveRecord | null>(null)

  return (
    <LiveRecordsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LiveRecordsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLiveRecords = () => {
  const liveRecordsContext = React.useContext(LiveRecordsContext)

  if (!liveRecordsContext) {
    throw new Error('useLiveRecords has to be used within <LiveRecordsContext>')
  }

  return liveRecordsContext
}
