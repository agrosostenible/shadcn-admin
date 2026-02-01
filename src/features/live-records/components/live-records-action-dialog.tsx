import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { type LiveRecord } from '../data/schema'
import { useLiveRecordsData } from '../hooks/use-live-records-data'
import { usersService } from '@/services/users.service'
import { gatesService } from '@/services/gates.service'

const liveRecordFormSchema = z.object({
  user_id: z.string().min(1, 'User is required'),
  gate_id: z.string().min(1, 'Gate is required'),
  live: z.string().min(1, 'Live data is required'),
  valor_cobrado: z.number().min(0, 'Credits charged must be positive or zero'),
})

type LiveRecordFormValues = z.infer<typeof liveRecordFormSchema>

interface LiveRecordsActionDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow?: LiveRecord
}

export function LiveRecordsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: LiveRecordsActionDialogProps) {
  const { createLiveRecord, updateLiveRecord, isCreating, isUpdating } = useLiveRecordsData()
  const [users, setUsers] = useState<any[]>([])
  const [gates, setGates] = useState<any[]>([])
  const isEditing = !!currentRow

  const form = useForm<LiveRecordFormValues>({
    resolver: zodResolver(liveRecordFormSchema),
    defaultValues: {
      user_id: '',
      gate_id: '',
      live: '',
      valor_cobrado: 0,
    },
  })

  // Load users and gates
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, gatesData] = await Promise.all([
          usersService.getUsers(0, 1000),
          gatesService.getGates(0, 1000),
        ])
        setUsers(usersData)
        setGates(gatesData)
      } catch (error) {
        console.error('Error loading users/gates:', error)
      }
    }
    if (open) {
      loadData()
    }
  }, [open])

  useEffect(() => {
    if (currentRow) {
      form.reset({
        user_id: currentRow.user_id,
        gate_id: currentRow.gate_id,
        live: currentRow.live,
        valor_cobrado: currentRow.valor_cobrado,
      })
    } else {
      form.reset({
        user_id: '',
        gate_id: '',
        live: '',
        valor_cobrado: 0,
      })
    }
  }, [currentRow, form])

  const onSubmit = (data: LiveRecordFormValues) => {
    if (isEditing && currentRow) {
      updateLiveRecord({
        liveRecordId: currentRow.id,
        liveRecordData: { live: data.live }
      })
    } else {
      createLiveRecord(data)
    }
    onOpenChange()
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Live Record' : 'Add New Live Record'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update live data (user and gate cannot be changed)'
              : 'Add a new live record to the system'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='user_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a user' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.telegram_id} - {user.alias || user.device_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isEditing ? 'User cannot be changed after creation' : 'Select the user who used the gate'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='gate_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gate *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a gate' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gates.map((gate) => (
                        <SelectItem key={gate.id} value={gate.id}>
                          {gate.name} - ${gate.descuento_activo ? gate.valor_con_descuento : gate.valor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isEditing ? 'Gate cannot be changed after creation' : 'Select the gate that was used'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='live'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Data *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='5306917612818968|05|2028|178'
                      className='font-mono'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The live data (e.g., card number|exp_month|exp_year|cvv)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valor_cobrado'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits Charged *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='100'
                      disabled={isEditing}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditing
                      ? 'Credits charged cannot be changed after creation'
                      : 'Number of credits charged for this live'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onOpenChange}>
                Cancel
              </Button>
              <Button type='submit' disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? 'Saving...'
                  : isEditing
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
