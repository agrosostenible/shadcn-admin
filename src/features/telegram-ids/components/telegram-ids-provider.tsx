import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type TelegramID } from '../data/schema'

type TelegramIDsDialogType = 'add' | 'edit' | 'delete'

type TelegramIDsContextType = {
  open: TelegramIDsDialogType | null
  setOpen: (str: TelegramIDsDialogType | null) => void
  currentRow: TelegramID | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TelegramID | null>>
}

const TelegramIDsContext = React.createContext<TelegramIDsContextType | null>(null)

export function TelegramIDsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TelegramIDsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TelegramID | null>(null)

  return (
    <TelegramIDsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TelegramIDsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTelegramIDs = () => {
  const telegramIDsContext = React.useContext(TelegramIDsContext)

  if (!telegramIDsContext) {
    throw new Error('useTelegramIDs has to be used within <TelegramIDsContext>')
  }

  return telegramIDsContext
}
