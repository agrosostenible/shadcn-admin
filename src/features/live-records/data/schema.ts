import { z } from 'zod'

const userInfoSchema = z.object({
  id: z.string(),
  device_id: z.string(),
  telegram_id: z.number(),
  alias: z.string().nullable(),
})

const gateInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  valor: z.number(),
  valor_con_descuento: z.number().nullable(),
  descuento_activo: z.boolean(),
})

const liveRecordSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  gate_id: z.string(),
  live: z.string(),
  valor_cobrado: z.number(),
  created_at: z.string(),
  user: userInfoSchema,
  gate: gateInfoSchema,
})

export type LiveRecord = z.infer<typeof liveRecordSchema>
export type UserInfo = z.infer<typeof userInfoSchema>
export type GateInfo = z.infer<typeof gateInfoSchema>

export const liveRecordListSchema = z.array(liveRecordSchema)
