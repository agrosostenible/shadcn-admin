import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LiveRecords } from '@/features/live-records'

const liveRecordsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  live: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/live-records/')({
  validateSearch: liveRecordsSearchSchema,
  component: LiveRecords,
})
