import { z } from 'zod'

const userRoleSchema = z.object({
  id: z.string(),
  name: z.union([z.literal('user'), z.literal('admin')]),
})

const userSchema = z.object({
  id: z.string(),
  device_id: z.string(),
  mac_address: z.string(),
  telegram_id: z.number(),
  alias: z.string().nullable(),
  credits: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  role: userRoleSchema,
})
export type User = z.infer<typeof userSchema>
export type UserRole = z.infer<typeof userRoleSchema>

export const userListSchema = z.array(userSchema)
