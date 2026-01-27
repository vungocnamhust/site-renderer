
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config()

async function run() {
  console.log('DEBUG: PAYLOAD_SECRET exists?', !!process.env.PAYLOAD_SECRET)
  
  // Dynamic import to ensure env vars are loaded first
  const { default: configPromise } = await import('@payload-config')
  
  const payload = await getPayload({ config: configPromise })

  console.log('🔄 reproduction script: Finding a tour...')
  
  // 1. Find a tour to update
  const tours = await payload.find({
    collection: 'tours',
    limit: 1,
  })

  if (tours.totalDocs === 0) {
    console.error('❌ No tours found to test with!')
    process.exit(1)
  }

  const tour = tours.docs[0]
  console.log(`✅ Found tour: ${tour.id} (${tour.title})`)
  console.log(`   Current countries:`, tour.countries)

  // 2. Attempt partial update (simulate "Edit Selected" in Admin UI)
  // Updating only 'isActive' or 'categories' (if categories exist)
  console.log('\n🔄 Attempting partial update (without countries)...')
  
  try {
    const result = await payload.update({
        collection: 'tours',
        id: tour.id,
        data: {
             // Simulating update of another field
             isActive: !tour.isActive 
        }
    })
    console.log('✅ Update successful!', result.id)
  } catch (err: any) {
    console.error('❌ Update failed!')
    console.error(JSON.stringify(err, null, 2))
    
    if (err.data) {
         console.error('Error Data:', err.data)
    }
  }
  
  process.exit(0)
}

run()
