import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  location: varchar('location', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }),
  subCategory: varchar('sub_category', { length: 100 }),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, upcoming, ongoing, completed, cancelled
  ticketsSold: integer('tickets_sold').default(0),
  totalRevenue: integer('total_revenue').default(0),
  uniqueAttendees: integer('unique_attendees').default(0),
  imageUrl: text('image_url'),
  logoUrl: text('logo_url'),
  policy: varchar('policy', { length: 255 }),
  organizer: varchar('organizer', { length: 255 }),
  organizerLogo: text('organizer_logo'),
  teams: jsonb('teams'), // Array of team objects
  tags: jsonb('tags'), // Array of tag strings
  timezone: varchar('timezone', { length: 100 }).default('GMT-6'),
  nftMintAddress: varchar('nft_mint_address', { length: 255 }), // Solana NFT mint address
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
