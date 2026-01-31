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
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { type User } from '../data/schema'
import { useUsersData } from '../hooks/use-users-data'
import { useRoles } from '@/hooks/use-roles'

const formSchema = z
  .object({
    device_id: z.string().min(1, 'Device ID is required.'),
    mac_address: z
      .string()
      .regex(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        'Invalid MAC address format. Use XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX'
      ),
    telegram_id: z.coerce.number().positive('Telegram ID must be a positive number.'),
    alias: z.string().optional(),
    credits: z.coerce.number().min(0, 'Credits cannot be negative.').optional(),
    password: z.string().optional().transform((pwd) => pwd?.trim() || undefined),
    confirmPassword: z.string().optional().transform((pwd) => pwd?.trim() || undefined),
    role_name: z.enum(['user', 'admin']).optional(),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password && data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password && password.length >= 6
    },
    {
      message: 'Password must be at least 6 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const { createUser, updateUser, isCreating, isUpdating } = useUsersData()
  const { roles } = useRoles()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          device_id: currentRow.device_id,
          mac_address: currentRow.mac_address,
          telegram_id: currentRow.telegram_id,
          alias: currentRow.alias || '',
          credits: currentRow.credits,
          password: '',
          confirmPassword: '',
          role_name: currentRow.role.name,
          isEdit,
        }
      : {
          device_id: '',
          mac_address: '',
          telegram_id: 0,
          alias: '',
          credits: 0,
          password: '',
          confirmPassword: '',
          role_name: 'user',
          isEdit,
        },
  })

  const onSubmit = (values: UserForm) => {
    const { confirmPassword, isEdit: _, ...data } = values

    if (isEdit && currentRow) {
      const updateData: any = {}
      if (data.device_id !== currentRow.device_id) updateData.device_id = data.device_id
      if (data.mac_address !== currentRow.mac_address) updateData.mac_address = data.mac_address
      if (data.telegram_id !== currentRow.telegram_id) updateData.telegram_id = data.telegram_id
      if (data.alias !== currentRow.alias) updateData.alias = data.alias || null
      if (data.credits !== currentRow.credits) updateData.credits = data.credits
      if (data.password) updateData.password = data.password
      if (data.role_name !== currentRow.role.name) updateData.role_name = data.role_name

      updateUser({ userId: currentRow.id, userData: updateData }, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      })
    } else {
      const createData: any = {
        device_id: data.device_id,
        mac_address: data.mac_address,
        telegram_id: data.telegram_id,
      }
      if (data.alias) createData.alias = data.alias
      if (data.password) createData.password = data.password

      createUser(createData, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      })
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='device_id'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Device ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='device-12345'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mac_address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      MAC Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='AA:BB:CC:DD:EE:FF'
                        className='col-span-4 font-mono'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='telegram_id'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Telegram ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='123456789'
                        className='col-span-4 font-mono'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='alias'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Alias
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Optional nickname'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {isEdit && (
                <FormField
                  control={form.control}
                  name='credits'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Credits
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='0'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
              {isEdit && (
                <FormField
                  control={form.control}
                  name='role_name'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>Role</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select a role'
                        className='col-span-4'
                        items={roles.map((role) => ({
                          label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
                          value: role.name,
                        }))}
                      />
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Password{isEdit && ' (optional)'}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Minimum 6 characters'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='Minimum 6 characters'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
