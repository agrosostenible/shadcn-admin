import { z } from 'zod'

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const gateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  valor: z.number(),
  valor_con_descuento: z.number(),
  descuento_activo: z.boolean(),
  estado: z.boolean(),
  ruta: z.string().nullable(),
  roles: z.array(roleSchema).optional(),
})

export type Gate = z.infer<typeof gateSchema>
export type Role = z.infer<typeof roleSchema>

export const gateListSchema = z.array(gateSchema)
