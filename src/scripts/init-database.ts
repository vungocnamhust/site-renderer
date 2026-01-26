/**
 * Initialize Database Tables Script
 * 
 * Payload CMS sẽ tự động tạo tables khi chạy lần đầu.
 * Script này chỉ cung cấp thông tin và hướng dẫn.
 * 
 * Usage: npx tsx src/scripts/init-database.ts
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function initDatabase() {
  const connectionString = process.env.DATABASE_URI

  if (!connectionString) {
    console.error('❌ DATABASE_URI not found in environment variables')
    process.exit(1)
  }

  const client = new Client({ connectionString })

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL...')
    await client.connect()
    console.log('✅ Connected successfully!\n')

    // Check if payload_migrations table exists (indicates Payload has been initialized)
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_migrations'
      )
    `)

    const payloadInitialized = result.rows[0].exists

    if (payloadInitialized) {
      console.log('✅ Payload CMS has already been initialized.')
      console.log('   Tables have been created by Payload migration system.')
      console.log('\n💡 To add new collections:')
      console.log('   1. Define collection in src/collections/')
      console.log('   2. Add to payload.config.ts')
      console.log('   3. Run "npm run dev" - Payload will migrate automatically')
    } else {
      console.log('⚠️  Payload CMS has not been initialized yet.')
      console.log('\n📋 What will happen when you run "npm run dev":')
      console.log('   1. Payload will detect missing tables')
      console.log('   2. Payload will run migrations automatically')
      console.log('   3. All required tables will be created')
      console.log('\n💡 Required tables that will be created:')
      console.log('   - users (Admin users)')
      console.log('   - media (Uploaded files)')
      console.log('   - tenants (Multi-tenant configuration)')
      console.log('   - payload_preferences (CMS settings)')
      console.log('   - payload_migrations (Migration tracking)')
      console.log('   - payload_locked_documents (Document locking)')
      console.log('\n🚀 Run "npm run dev" to start the initialization process.')
    }

    // Check for any existing data in users table
    try {
      const usersResult = await client.query('SELECT COUNT(*) FROM users')
      const userCount = parseInt(usersResult.rows[0].count, 10)
      if (userCount > 0) {
        console.log(`\n👤 Found ${userCount} existing user(s) in database.`)
      }
    } catch {
      // Table doesn't exist yet, ignore
    }

  } catch (error) {
    console.error('❌ Error connecting to database:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n🔌 Disconnected from database.')
  }
}

initDatabase()
