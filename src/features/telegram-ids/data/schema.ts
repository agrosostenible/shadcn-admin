import { z } from 'zod'

const telegramIDSchema = z.object({
  id: z.string(),
  telegram_id: z.number(),
})
export type TelegramID = z.infer<typeof telegramIDSchema>

export const telegramIDListSchema = z.array(telegramIDSchema)
