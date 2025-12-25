import { z } from 'zod'

export const eventStatusSchema = z.enum([
  'draft',
  'upcoming',
  'ongoing',
  'completed',
  'cancelled',
])

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(255),
  description: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
  location: z.string().min(1, 'Location is required').max(500),
  category: z.string().max(100).optional(),
  subCategory: z.string().max(100).optional(),
  status: eventStatusSchema.default('draft'),
  ticketsSold: z.number().int().min(0).default(0),
  totalRevenue: z.number().int().min(0).default(0),
  uniqueAttendees: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  policy: z.string().max(255).optional(),
  organizer: z.string().max(255).optional(),
  organizerLogo: z.string().optional().or(z.literal('')),
  teams: z
    .array(
      z.object({
        name: z.string(),
        logo: z.string().optional(),
      }),
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  timezone: z.string().default('GMT-6'),
})

export const updateEventSchema = createEventSchema.partial()

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
