import { successResponse, errorResponse } from '@/app/lib/api-response'
import { createEventSchema } from '@/app/lib/validations/event'
import { NextRequest, NextResponse } from 'next/server'
import { createEvent, getAllEvents } from '@/app/lib/services/event-service'

// Force Node.js runtime - Drizzle + Postgres does not work on Edge
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    const event = await createEvent({
      name: validatedData.name,
      description: validatedData.description || null,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      location: validatedData.location,
      category: validatedData.category || null,
      subCategory: validatedData.subCategory || null,
      status: validatedData.status,
      ticketsSold: validatedData.ticketsSold,
      totalRevenue: validatedData.totalRevenue,
      uniqueAttendees: validatedData.uniqueAttendees,
      imageUrl: validatedData.imageUrl || null,
      logoUrl: validatedData.logoUrl || null,
      policy: validatedData.policy || null,
      organizer: validatedData.organizer || null,
      organizerLogo: validatedData.organizerLogo || null,
      teams: validatedData.teams ? JSON.stringify(validatedData.teams) : null,
      tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
      timezone: validatedData.timezone,
    })

    return NextResponse.json(successResponse(event), { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          errorResponse('VALIDATION_ERROR', error.message),
          { status: 400 },
        )
      }
      // Check if it's a database connection error
      if (
        error.message.includes('DATABASE_URL') ||
        error.message.includes('database')
      ) {
        return NextResponse.json(
          errorResponse(
            'DATABASE_ERROR',
            'Database connection failed. Please check your DATABASE_URL environment variable.',
          ),
          { status: 500 },
        )
      }
      return NextResponse.json(errorResponse('INTERNAL_ERROR', error.message), {
        status: 500,
      })
    }
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'An unknown error occurred'),
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const result = await Promise.race([
      getAllEvents({ status, search, startDate, endDate }, { page, limit }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Database query timeout after 15 seconds')),
          15000,
        ),
      ),
    ])

    return NextResponse.json(
      successResponse({
        events: result.events,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      }),
    )
  } catch (error) {
    console.error('Error in GET /api/events:', error)
    if (error instanceof Error) {
      // Check if it's a database connection error
      const errorMessage = error.message.toLowerCase()
      if (
        errorMessage.includes('database_url') ||
        errorMessage.includes('database') ||
        errorMessage.includes('etimedout') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('connect') ||
        errorMessage.includes('connection')
      ) {
        return NextResponse.json(
          errorResponse(
            'DATABASE_ERROR',
            `Database connection failed: ${error.message}. Please check: 1) Your DATABASE_URL is correct, 2) The database server is running, 3) Your network/firewall allows connections, 4) The database credentials are correct.`,
          ),
          { status: 500 },
        )
      }
      return NextResponse.json(errorResponse('INTERNAL_ERROR', error.message), {
        status: 500,
      })
    }
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'An unknown error occurred'),
      { status: 500 },
    )
  }
}
