
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function fixPostgisSchema() {
  const connectionString = process.env.DATABASE_URI

  if (!connectionString) {
    console.error('❌ DATABASE_URI not found in environment variables')
    process.exit(1)
  }

  const client = new Client({ connectionString })

  try {
    console.log('🔌 Connecting to Database...')
    await client.connect()
    console.log('✅ Connected successfully!')

    console.log('🛠️  Moving PostGIS to its own schema to prevent Payload/Drizzle interference...')

    // 1. Create schema
    await client.query('CREATE SCHEMA IF NOT EXISTS postgis;')
    console.log('  - Schema "postgis" ensured.')

    // 2. Move extension (this moves functions, operators, etc.)
    try {
      await client.query('ALTER EXTENSION postgis SET SCHEMA postgis;')
      console.log('  - Extension "postgis" moved to schema "postgis".')
    } catch (e: any) {
      console.log('  - Note: Could not move extension (it might already be moved or permission denied). Detail: ' + e.message)
    }

    // 3. Move the problematic table spatial_ref_sys
    try {
      await client.query('ALTER TABLE public.spatial_ref_sys SET SCHEMA postgis;')
      console.log('  - Table "spatial_ref_sys" moved to schema "postgis".')
    } catch (e: any) {
       if (e.message.includes('does not exist')) {
         console.log('  - Table "spatial_ref_sys" already moved or not in public schema.')
       } else {
         console.error('  - Error moving table: ' + e.message)
       }
    }

    // 4. Update search path so ST_ functions still work without schema prefix
    // Get current database name
    const dbRes = await client.query('SELECT current_database();')
    const dbName = dbRes.rows[0].current_database
    
    await client.query(`ALTER DATABASE "${dbName}" SET search_path TO public, postgis;`)
    console.log(`  - Database search_path updated for "${dbName}".`)

    console.log('\n✅ PostGIS isolation complete! Now "db push" should work without touching system tables.')

  } catch (error: any) {
    console.error('❌ Critical error:', error.message)
  } finally {
    await client.end()
  }
}

fixPostgisSchema()
