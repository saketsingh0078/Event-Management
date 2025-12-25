import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// For serverless environments, we need to handle connections differently
// Global connection pool that persists across function invocations
declare global {
  // eslint-disable-next-line no-var
  var dbPool: Pool | undefined
  // eslint-disable-next-line no-var
  var dbInstance: NodePgDatabase<typeof schema> | undefined
}

export function getDb() {
  const connectionString = process.env.DATABASE_URL || ''

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please configure your database connection in your environment variables.',
    )
  }

  // In serverless environments, we need to reuse the connection pool
  // but also handle cases where it might not exist
  if (!global.dbPool || !global.dbInstance) {
    let parsedUrl: URL | null = null
    try {
      const urlString =
        connectionString.startsWith('postgres://') ||
        connectionString.startsWith('postgresql://')
          ? connectionString
          : `postgresql://${connectionString}`
      parsedUrl = new URL(urlString)
    } catch {
      throw new Error(
        'Invalid DATABASE_URL format. Please use the format: postgres://user:password@host:port/database',
      )
    }

    try {
      // Determine SSL configuration
      // Supabase and most production databases require SSL
      const isSupabase = 
        connectionString.includes('supabase.co') ||
        connectionString.includes('supabase.com')
      
      // Check if connection string already has SSL parameters
      const url = parsedUrl
      
      // Enable SSL for Supabase, production, or if connection string indicates SSL
      const needsSSL =
        isSupabase ||
        process.env.NODE_ENV === 'production' ||
        url.searchParams.get('sslmode') === 'require' ||
        url.searchParams.get('ssl') === 'true' ||
        connectionString.includes('sslmode=require') ||
        connectionString.includes('ssl=true')

      // Configure pool for serverless environments
      // Use smaller pool size for serverless (each function gets its own pool)
      // Supabase direct connections work best with max: 1 in serverless
      global.dbPool = new Pool({
        connectionString,
        max: 1, // Single connection per serverless function (required for Supabase direct connection)
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        // Supabase requires SSL - use rejectUnauthorized: false for Supabase
        ssl: needsSSL
          ? {
              rejectUnauthorized: false, // Supabase uses self-signed certificates
            }
          : undefined,
      })

      // Handle connection errors
      global.dbPool.on('error', (err) => {
        console.error('Unexpected database pool error:', err)
      })

      global.dbInstance = drizzle(global.dbPool, { schema })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      const hostInfo = parsedUrl
        ? ` (host: ${parsedUrl.hostname}, port: ${parsedUrl.port || 5432})`
        : ''
      throw new Error(
        `Failed to initialize database connection${hostInfo}: ${errorMessage}. ` +
          `Please verify: 1) DATABASE_URL is correct, 2) Database server is running, ` +
          `3) Network/firewall allows connections, 4) Credentials are valid, ` +
          `5) SSL is properly configured if required.`,
      )
    }
  }

  if (!global.dbInstance) {
    throw new Error('Database connection not initialized')
  }

  return global.dbInstance
}
