import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { TelegramIDs } from '@/features/telegram-ids'

const telegramIDsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter
  telegram_id: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/telegram-ids/')({
  validateSearch: telegramIDsSearchSchema,
  component: TelegramIDs,
})
