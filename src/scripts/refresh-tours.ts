
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function refreshTours() {
  const payload = await getPayload({ config })
  console.log('--- REFRESHING TOURS TO TRIGGER AUTO-CALCULATIONS ---')

  const tours = await payload.find({
    collection: 'tours',
    limit: 0,
    depth: 0,
  })

  for (const tour of tours.docs as any) {
    console.log(`Refreshing Tour: ${tour.title} (ID: ${tour.id})`);
    
    // We just need to trigger an update. The beforeChange hook will handle the rest.
    // We pass the existing data back.
    await payload.update({
      collection: 'tours',
      id: tour.id,
      data: {
          // Just triggering the hook
          updatedAt: new Date().toISOString()
      },
    });
  }

  console.log('--- DONE ---');
  process.exit(0);
}

refreshTours();
