import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let connection: Pool | null = null
let dbInstance: NodePgDatabase<typeof schema> | null = null

export function getDb() {
  const connectionString = process.env.DATABASE_URL || ''

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please configure your database connection in .env.local',
    )
  }

  if (!connection) {
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
      connection = new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      })
      dbInstance = drizzle(connection, { schema })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      const hostInfo = parsedUrl
        ? ` (host: ${parsedUrl.hostname}, port: ${parsedUrl.port || 5432})`
        : ''
      throw new Error(
        `Failed to initialize database connection${hostInfo}: ${errorMessage}. ` +
          `Please verify: 1) DATABASE_URL is correct, 2) Database server is running, ` +
          `3) Network/firewall allows connections, 4) Credentials are valid.`,
      )
    }
  }

  if (!dbInstance) {
    throw new Error('Database connection not initialized')
  }

  return dbInstance
}
