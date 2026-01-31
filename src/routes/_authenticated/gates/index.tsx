import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Gates } from '@/features/gates'

const gatesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/gates/')({
  validateSearch: gatesSearchSchema,
  component: Gates,
})
