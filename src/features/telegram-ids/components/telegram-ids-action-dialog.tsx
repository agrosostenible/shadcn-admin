'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type TelegramID } from '../data/schema'
import { useTelegramIDsData } from '../hooks/use-telegram-ids-data'

const formSchema = z.object({
  telegram_id: z.coerce.number().positive('Telegram ID must be a positive number.'),
})
type TelegramIDForm = z.infer<typeof formSchema>

type TelegramIDActionDialogProps = {
  currentRow?: TelegramID
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TelegramIDsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: TelegramIDActionDialogProps) {
  const isEdit = !!currentRow
  const { createTelegramID, updateTelegramID, isCreating, isUpdating } =
    useTelegramIDsData()

  const form = useForm<TelegramIDForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          telegram_id: currentRow.telegram_id,
        }
      : {
          telegram_id: 0,
        },
  })

  const onSubmit = (values: TelegramIDForm) => {
    if (isEdit && currentRow) {
      updateTelegramID(
        {
          telegramIdUuid: currentRow.id,
          telegramData: { telegram_id: values.telegram_id },
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    } else {
      createTelegramID(
        { telegram_id: values.telegram_id },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Telegram ID' : 'Add New Telegram ID'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the Telegram ID here. '
              : 'Register a new Telegram ID here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form
              id='telegram-id-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='telegram_id'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-4 items-center space-y-0 gap-x-4 gap-y-2'>
                    <FormLabel className='text-end'>Telegram ID</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='123456789'
                        className='col-span-3 font-mono'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-3 col-start-2' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='telegram-id-form'
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
