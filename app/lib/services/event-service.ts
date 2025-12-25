import { getDb } from '@/db'
import { events, NewEvent, Event } from '@/db/schema'
import { and, count, desc, eq, gte, like, lte, or } from 'drizzle-orm'

export type EventFilters = {
  status?: string
  search?: string
  startDate?: string
  endDate?: string
}

export type PaginationParams = {
  page?: number
  limit?: number
}

export async function createEvent(data: NewEvent): Promise<Event> {
  const db = getDb()
  const result = await db.insert(events).values(data).returning()

  if (!result || result.length === 0) {
    throw new Error('Failed to create event: no data returned')
  }

  return result[0]
}

export async function getEventById(id: number): Promise<Event | null> {
  const db = getDb()
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1)
  return event || null
}

export async function getAllEvents(
  filters?: EventFilters,
  pagination?: PaginationParams,
): Promise<{ events: Event[]; total: number }> {
  const page = pagination?.page || 1
  const limit = pagination?.limit || 10
  const offset = (page - 1) * limit

  const conditions = []

  if (filters?.status) {
    conditions.push(eq(events.status, filters.status))
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(events.name, `%${filters.search}%`),
        like(events.location, `%${filters.search}%`),
      ),
    )
  }

  if (filters?.startDate) {
    conditions.push(gte(events.startDate, new Date(filters.startDate)))
  }

  if (filters?.endDate) {
    // Filter events that start on or before the end date
    // This ensures we get events that start within the date range
    conditions.push(lte(events.startDate, new Date(filters.endDate)))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  try {
    const db = getDb()
    const [eventsList, totalResult] = await Promise.all([
      db
        .select()
        .from(events)
        .where(whereClause)
        .orderBy(desc(events.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count(events.id) })
        .from(events)
        .where(whereClause),
    ])

    return {
      events: eventsList,
      total: Number(totalResult[0]?.count) || 0,
    }
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()
      
      // Check for missing table
      if (errorMsg.includes('does not exist') && errorMsg.includes('table')) {
        throw new Error(
          `Database table 'events' does not exist. Please run migrations in production. ` +
          `For Vercel: Add a build command or run migrations manually: ` +
          `DATABASE_URL=your_production_url npm run db:migrate. ` +
          `Original error: ${error.message}`,
        )
      }
      
      // Check for missing column (e.g., created_at)
      if (errorMsg.includes('does not exist') && errorMsg.includes('column')) {
        throw new Error(
          `Database column missing. This usually means migrations haven't been applied to production. ` +
          `Please run: DATABASE_URL=your_production_url npm run db:migrate. ` +
          `Original error: ${error.message}`,
        )
      }
      
      // Check for connection issues
      if (
        errorMsg.includes('database_url') ||
        errorMsg.includes('connection') ||
        errorMsg.includes('connect') ||
        errorMsg.includes('timeout') ||
        errorMsg.includes('etimedout') ||
        errorMsg.includes('ssl') ||
        errorMsg.includes('certificate')
      ) {
        throw new Error(
          `Database connection failed. Please check: ` +
          `1) DATABASE_URL environment variable is set in Vercel, ` +
          `2) Database server is accessible, ` +
          `3) SSL is properly configured (if required), ` +
          `4) Network/firewall allows connections. ` +
          `Original error: ${error.message}`,
        )
      }
      
      // Check for permission issues
      if (
        errorMsg.includes('permission') ||
        errorMsg.includes('access denied') ||
        errorMsg.includes('authentication')
      ) {
        throw new Error(
          `Database authentication failed. Please verify your DATABASE_URL credentials. ` +
          `Original error: ${error.message}`,
        )
      }
    }
    throw error
  }
}

export async function updateEvent(
  id: number,
  data: Partial<NewEvent>,
): Promise<Event | null> {
  const db = getDb()
  const result = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning()

  if (!result || result.length === 0) {
    return null
  }

  return result[0]
}

export async function deleteEvent(id: number): Promise<boolean> {
  const db = getDb()
  await db.delete(events).where(eq(events.id, id))
  const event = await getEventById(id)
  return event === null
}
