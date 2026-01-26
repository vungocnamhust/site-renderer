/**
 * Check Database Tables Script
 * 
 * Kiểm tra trạng thái các tables trong Supabase PostgreSQL
 * Usage: npx tsx src/scripts/check-database.ts
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const REQUIRED_TABLES = [
  'users',
  'media',
  'tenants',
  'payload_preferences',
  'payload_migrations',
  'payload_locked_documents',
  'payload_locked_documents_rels',
]

async function checkDatabase() {
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

    // Get all tables in public schema
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    const existingTables = result.rows.map(row => row.table_name)

    console.log('📋 Existing tables in database:')
    if (existingTables.length === 0) {
      console.log('   (No tables found)')
    } else {
      existingTables.forEach(table => {
        const isRequired = REQUIRED_TABLES.includes(table)
        console.log(`   ${isRequired ? '✓' : '○'} ${table}`)
      })
    }

    console.log('\n📊 Required tables status:')
    const missingTables: string[] = []
    const extraTables: string[] = []

    REQUIRED_TABLES.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`)
      } else {
        console.log(`   ❌ ${table} (MISSING)`)
        missingTables.push(table)
      }
    })

    existingTables.forEach(table => {
      if (!REQUIRED_TABLES.includes(table)) {
        extraTables.push(table)
      }
    })

    console.log('\n📈 Summary:')
    console.log(`   Total existing tables: ${existingTables.length}`)
    console.log(`   Required tables found: ${REQUIRED_TABLES.length - missingTables.length}/${REQUIRED_TABLES.length}`)
    
    if (missingTables.length > 0) {
      console.log(`   ⚠️  Missing tables: ${missingTables.join(', ')}`)
      console.log('\n💡 Run "npm run db:init" or "npm run dev" to create missing tables.')
    } else {
      console.log('   ✅ All required tables exist!')
    }

    if (extraTables.length > 0) {
      console.log(`\n📌 Extra tables (not required by Payload): ${extraTables.join(', ')}`)
    }

  } catch (error) {
    console.error('❌ Error connecting to database:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n🔌 Disconnected from database.')
  }
}

checkDatabase()
