
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function syncSchemaManually() {
  const payload = await getPayload({ config })
  const db = (payload.db as any).drizzle

  console.log('Synchronizing TransitHubs schema manually...')

  try {
    // 1. Create Enum
    await db.execute(`
        DO $$ BEGIN
            CREATE TYPE "enum_transit_hubs_type" AS ENUM('airport', 'train_station', 'pier', 'bus_station');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    `)

    // 2. Create Transit Hubs table
    await db.execute(`
        CREATE TABLE IF NOT EXISTS "transit_hubs" (
            "id" serial PRIMARY KEY,
            "name" varchar NOT NULL,
            "code" varchar,
            "type" "enum_transit_hubs_type" NOT NULL,
            "latitude" numeric,
            "longitude" numeric,
            "district_id" integer NOT NULL,
            "country_id" integer NOT NULL,
            "description" varchar,
            "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
            "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
        );
    `)

    // 3. Add columns to districts
    await db.execute(`
        ALTER TABLE "districts" 
        ADD COLUMN IF NOT EXISTS "is_hub" boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS "logistics_nearest_airport_id" integer,
        ADD COLUMN IF NOT EXISTS "logistics_nearest_train_station_id" integer,
        ADD COLUMN IF NOT EXISTS "logistics_transfer_notes" varchar;
    `)

    // 4. Fix Payload Document Locking tables for new collections
    await db.execute(`
        ALTER TABLE "payload_locked_documents_rels" 
        ADD COLUMN IF NOT EXISTS "transit_hubs_id" integer,
        ADD COLUMN IF NOT EXISTS "markets_id" integer,
        ADD COLUMN IF NOT EXISTS "experience_themes_id" integer;
    `)

    console.log('Manual sync completed successfully.')
  } catch (err) {
    console.error('Error during manual sync:', err)
  }

  process.exit(0)
}

syncSchemaManually()
