import { useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { type Gate } from '../data/schema'
import { useGatesData } from '../hooks/use-gates-data'
import { useRoles } from '@/hooks/use-roles'

const gateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  valor: z.number().min(0, 'Price must be positive'),
  valor_con_descuento: z.number().min(0, 'Discount price must be positive'),
  descuento_activo: z.boolean(),
  role_ids: z.array(z.string()).optional(),
})

type GateFormValues = z.infer<typeof gateFormSchema>

interface GatesActionDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow?: Gate
}

export function GatesActionDialog({
  open,
  onOpenChange,
  currentRow,
}: GatesActionDialogProps) {
  const { createGate, updateGate, isCreating, isUpdating } = useGatesData()
  const { roles } = useRoles()
  const isEditing = !!currentRow

  const form = useForm<GateFormValues>({
    resolver: zodResolver(gateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      valor: 0,
      valor_con_descuento: 0,
      descuento_activo: false,
      role_ids: [],
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || '',
        valor: currentRow.valor,
        valor_con_descuento: currentRow.valor_con_descuento,
        descuento_activo: currentRow.descuento_activo,
        role_ids: currentRow.roles?.map((r) => r.id) || [],
      })
    } else {
      form.reset({
        name: '',
        description: '',
        valor: 0,
        valor_con_descuento: 0,
        descuento_activo: false,
        role_ids: [],
      })
    }
  }, [currentRow, form])

  const onSubmit = (data: GateFormValues) => {
    if (isEditing && currentRow) {
      updateGate({ gateId: currentRow.id, gateData: data })
    } else {
      createGate(data)
    }
    onOpenChange()
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Gate' : 'Add New Gate'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update gate information and role associations'
              : 'Add a new Terminator model to the system'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='T-800' {...field} />
                  </FormControl>
                  <FormDescription>
                    Terminator model name (e.g., T-800, T-1000, Rev-9)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Model 101 - Basic endoskeleton'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='valor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='1000'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='valor_con_descuento'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='750'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='descuento_activo'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Discount Active
                    </FormLabel>
                    <FormDescription>
                      Enable discount pricing for this gate
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role_ids'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel className='text-base'>Associated Roles</FormLabel>
                    <FormDescription>
                      Select which roles have access to this gate
                    </FormDescription>
                  </div>
                  <div className='space-y-2'>
                    {roles.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name='role_ids'
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role.id}
                              className='flex flex-row items-start space-x-3 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), role.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className='font-normal capitalize'>
                                {role.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
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
