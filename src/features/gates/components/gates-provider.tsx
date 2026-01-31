import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Gate } from '../data/schema'

type GatesDialogType = 'add' | 'edit' | 'delete'

type GatesContextType = {
  open: GatesDialogType | null
  setOpen: (str: GatesDialogType | null) => void
  currentRow: Gate | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Gate | null>>
}

const GatesContext = React.createContext<GatesContextType | null>(null)

export function GatesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<GatesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Gate | null>(null)

  return (
    <GatesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GatesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGates = () => {
  const gatesContext = React.useContext(GatesContext)

  if (!gatesContext) {
    throw new Error('useGates has to be used within <GatesContext>')
  }

  return gatesContext
}
