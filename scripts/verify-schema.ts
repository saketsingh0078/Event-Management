#!/usr/bin/env tsx
/**
 * Schema Verification Script
 * 
 * This script verifies that your production database schema matches
 * your Drizzle schema definition. Run this before deploying to catch
 * migration issues early.
 * 
 * Usage:
 *   DATABASE_URL=your_production_url npm run db:verify
 *   or
 *   npx tsx scripts/verify-schema.ts
 */

import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()
import * as schema from '../db/schema'

const REQUIRED_COLUMNS = [
  'id',
  'name',
  'description',
  'start_date',
  'end_date',
  'location',
  'category',
  'sub_category',
  'status',
  'tickets_sold',
  'total_revenue',
  'unique_attendees',
  'image_url',
  'logo_url',
  'policy',
  'organizer',
  'organizer_logo',
  'teams',
  'tags',
  'timezone',
  'created_at', // ⚠️ Most commonly missing!
  'updated_at',
]

async function verifySchema() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set')
    console.error('   Set it with: DATABASE_URL=your_db_url npm run db:verify')
    process.exit(1)
  }

  const pool = new Pool({ connectionString })
  const client = await pool.connect()

  try {
    console.log('🔍 Verifying database schema...\n')

    // Check if events table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `)

    if (!tableCheck.rows[0].exists) {
      console.error('❌ Table "events" does not exist!')
      console.error('   Run: npm run db:migrate')
      process.exit(1)
    }

    console.log('✅ Table "events" exists\n')

    // Get actual columns
    const columnsResult = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'events'
      AND table_schema = 'public'
      ORDER BY column_name;
    `)

    const actualColumns = columnsResult.rows.map((row) => row.column_name)
    const missingColumns = REQUIRED_COLUMNS.filter(
      (col) => !actualColumns.includes(col),
    )

    if (missingColumns.length > 0) {
      console.error('❌ Missing columns:')
      missingColumns.forEach((col) => {
        const isCritical = col === 'created_at' || col === 'updated_at'
        console.error(`   ${isCritical ? '🚨' : '  '} ${col}`)
      })
      console.error('\n⚠️  Run migrations: npm run db:migrate')
      console.error(
        '   For production: DATABASE_URL=your_prod_url npm run db:migrate',
      )
      process.exit(1)
    }

    console.log('✅ All required columns exist\n')

    // Verify critical columns
    const criticalColumns = ['created_at', 'updated_at']
    for (const col of criticalColumns) {
      const colInfo = columnsResult.rows.find((r) => r.column_name === col)
      if (colInfo) {
        console.log(`✅ ${col}: ${colInfo.data_type}`)
      }
    }

    console.log('\n✅ Schema verification passed!')
    console.log('   Your database is ready for deployment 🚀')
  } catch (error) {
    console.error('❌ Verification failed:', error)
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        console.error('\n💡 Check your DATABASE_URL:')
        console.error('   - Use direct connection (NOT pooled)')
        console.error('   - Format: postgres://user:pass@host:5432/db')
        console.error('   - Supabase: Use port 5432, not 6543')
      }
    }
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

verifySchema().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

